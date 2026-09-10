# 만세력 프론트엔드 계약과 서버 저장 경계

## 책임 경계

```text
입력 폼
  → CreateSajuProfileRequestDto
  → NestJS 검증·정규화·만세력 계산
  → SajuChartSnapshotV1
  → DB SajuChart.payload(JSONB)
  → SajuChartDto
  → ManseoryeokChartViewModel
  → UI 컴포넌트
```

- 프론트엔드는 생년월일시 입력과 결과 표시만 담당한다.
- 날짜 변환, 사주 원국, 십성, 공망, 오행 구성, 대운은 서버가 계산한다.
- 계산 라이브러리의 반환 타입은 API나 DB JSON에 직접 노출하지 않는다.
- API 응답은 leaf UI에 그대로 전달하지 않고 ViewModel로 변환한다.
- AI 풀이 요청에는 Snapshot 전체가 아니라 `chartId`만 전달한다.

## 프론트엔드 타입 위치

| 구분 | 위치 | 역할 |
| --- | --- | --- |
| Snapshot domain type | `src/entities/saju_chart/model/saju_chart.ts` | 서버가 반환하는 직렬화 가능한 만세력 결과 계약 |
| Request/response DTO | `src/entities/saju_chart/api/saju_chart_dto.ts` | 프로필·차트·풀이 API의 임시 외부 경계. OpenAPI 타입 생성 후 생성 타입을 사용한다. |
| Demo Snapshot | `src/entities/saju_chart/model/demo_saju_chart.ts` | 서버 연결 전 UI 검증 전용 고정 데이터 |
| UI ViewModel | `src/widgets/manseoryeok_chart/model/manseoryeok_view_model.ts` | 화면 문구와 표시 순서로 변환된 타입 |
| DTO → ViewModel mapper | `src/widgets/manseoryeok_chart/lib/to_manseoryeok_view_model.ts` | API 구조가 leaf UI에 새지 않도록 하는 변환 경계 |

Backend는 별도 저장소인 `saju-platform-server`에서 관리한다. Backend의 Zod schema와 OpenAPI 문서를 계약의 source of truth로 두고, Frontend는 생성 체계 도입 전까지만 entity의 `api` segment에 경계 타입을 둔다. Prisma 타입이나 Backend source file을 Frontend에서 직접 import하지 않는다.

공통 성공 응답은 `{ code, message, data }`, 공통 오류 응답은 `{ code, message, data: { reason, fieldErrors? } | null }` 형식을 사용한다. `code`는 실제 HTTP status와 같고 요청 추적 ID는 body가 아닌 `x-request-id` header에서 읽는다.

## DB 모델에서 유지할 데이터

프론트엔드에 Prisma 타입을 복제하지 않는다. 백엔드는 다음 책임을 갖는 별도 모델을 둔다.

### SajuProfile

| 필드군 | 목적 |
| --- | --- |
| `ownerUserId`, `displayName`, `relationType` | 소유권과 프로필 정보 |
| 달력, 생년월일, 시간 정밀도, 시각, 윤달, 성별 기준값, timezone | 사용자가 입력한 계산 원본 |
| `currentChartId` | 현재 활성화된 불변 Snapshot 참조 |
| `createdAt`, `updatedAt` | 생성·변경 수명 주기 |
| `deletedAt` | 운영상 비노출 처리를 위한 예약 필드. 사용자 삭제는 hard delete |

### SajuChart

| 필드군 | 목적 | API 노출 |
| --- | --- | --- |
| `id`, `profileId` | 차트 식별과 프로필 연결 | 노출 |
| `schemaVersion`, `engineName`, `engineVersion`, `policyVersion` | 재현성과 마이그레이션 | Snapshot 내부에서 노출 |
| `inputHash` | 같은 입력의 중복 계산 방지 | 비노출 |
| `payload` JSONB | `SajuChartSnapshotV1` 원본 저장 | API에서 `snapshot`으로 노출 |
| 원국 코드, 일간 코드 | 검색·통계용 역정규화 | 비노출 |
| `calculatedAt` | 계산 시점 | Snapshot 내부에서 노출 |

생년월일시가 바뀌면 기존 `SajuChart`를 수정하지 않고 새 차트를 만든 뒤 `currentChartId`만 갱신한다. 표시 이름만 바뀌면 재계산하지 않는다.

## Snapshot 불변 조건

- `schemaVersion: 1`
- `timezone: "Asia/Seoul"`
- 시간 입력이 있으면 `pillars.hour`가 존재하고 `totalSymbols`는 `8`이다.
- 시간 미상은 `pillars.hour: null`, `quality: "partial"`, `totalSymbols: 6`으로 반환한다.
- 시간 미상으로 대운을 확정할 수 없으면 `luckCycle: null`과 warning을 함께 반환한다.
- `elementDistribution`은 단순 글자 수인 “오행 구성”이며 “오행 강약”으로 표현하지 않는다.
- `voidBranches`는 `code`, `korean`, `hanja`만 갖는 축약 객체다.
- 모든 날짜는 숫자 객체, 계산 시점은 ISO 8601 문자열로 직렬화한다.

## API 단위

- `POST /v1/saju-profiles`: 프로필과 최초 차트를 함께 생성한다.
- `GET /v1/saju-profiles`: 차트 본문 없이 프로필 요약만 반환한다.
- `GET /v1/saju-profiles/:profileId`: 프로필과 현재 차트를 함께 반환한다.
- `PATCH /v1/saju-profiles/:profileId`: 프로필을 수정한다. 계산 입력이
  바뀌면 새 불변 차트를 만들며, 같은 엔진·정책·입력의 차트가 이미 있으면
  해당 스냅샷을 재사용한다.
- `DELETE /v1/saju-profiles/:profileId`: 프로필을 hard delete하고 연결된
  모든 `SajuChart`를 database cascade로 영구 삭제한다. 대표 프로필을
  삭제하면 남은 프로필 중 가장 먼저 등록한 프로필을 새 대표로 지정한다.

향후 저장 풀이 모델은 입력에 사용한 `chartId`를 외래키로 보관한다.
프로필 삭제 시에는 같은 transaction 안에서 해당 프로필의 차트를 참조하는
풀이 결과를 먼저 명시적으로 삭제한 뒤 프로필과 차트를 삭제한다. 풀이에서
차트로 향하는 외래키는 `RESTRICT`로 두어 누락된 종속 데이터가 있으면 전체
삭제를 rollback한다. 결제·정산 기록은 풀이 본문과 분리하여 법적 보존 정책을
적용하며, 프로필 삭제는 환불을 의미하지 않는다.

아래 API는 다음 vertical slice에서 추가한다.

- `GET /v1/saju-charts/:chartId`: 특정 불변 Snapshot을 조회한다.
- `POST /v1/saju-readings`: `chartId` 또는 관계 풀이용 두 `chartId`만 받는다.

## 현재 UI 연결

`/my-saju`는 `GET /v1/saju-profiles`에서 대표 프로필을 찾고,
`GET /v1/saju-profiles/:profileId`의 `chart.snapshot`을 만세력 UI에 표시한다.
등록 폼은 `POST /v1/saju-profiles`를 호출하며 브라우저 임시 저장소를 사용하지 않는다.
