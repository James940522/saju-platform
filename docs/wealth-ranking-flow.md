# 재물운 랭킹 API 연동

2026-09-12. `/readings/wealth-ranking/start`의 예시 결과를 실제 Backend 풀이로 교체했다.

## 사용 흐름

1. 로그인하지 않은 경우 `/login?intent=wealth-ranking`으로 이동한다. 기존 가입 확인 흐름을 완료한 계정으로 이용한다.
2. 내 계정의 저장된 사주를 선택하거나 새 참여자의 이름·생년월일·성별·출생시간을 입력한다. 양력/음력·윤달·시간 미상은 기존 사주 입력 계약을 따른다.
3. 신규 입력은 `POST /v1/saju-profiles`에 저장한다. 추가된 참여자를 비교에서 제외해도 저장된 사주는 삭제하지 않는다.
4. 2~5명의 서로 다른 프로필을 선택하고 `POST /v1/readings/wealth-ranking`에 `{ chartIds }`를 보낸다. 이름이나 만세력 snapshot을 AI 요청으로 직접 보내지 않는다.
5. 서버가 정한 순위, 개인별 한 문장 재물운, 한 단락의 비교 근거를 표시한다. 시간 미상 등 계산 안내와 오락용 안내도 응답에서 가져온다.

같은 이름의 사람은 차트 ID로 구분한다. 선택 순서를 점수나 순위로 사용하지 않는다. 참여자 누락·중복·다른 차트·잘못된 순번/형식이면 결과를 거절하고 오류를 표시한다.

## 저장과 재시도

- 프로필 저장 실패 후 같은 입력을 다시 제출하면 같은 멱등 키를 사용한다. 입력 내용이 달라지면 새 키를 사용한다.
- 생성 중에는 참여자 변경과 중복 요청을 막는다. 429, 502/503/504, 인증 만료, 삭제된 차트 등에 대한 안내를 표시한다. 오류 이후 선택된 참여자는 유지한다.
- AI 요청은 자동 재시도하지 않는다. 사용자가 다시 시도하면 같은 선택 차트로 새 풀이를 요청하며 결과는 달라질 수 있다.
- 이 요청에만 70초 timeout을 사용한다. 다른 API의 기본 10초 timeout은 유지한다.
- 계정 변경과 페이지 이동 시 진행 중 브라우저 요청을 취소하고 이전 결과를 표시하지 않는다. 서버가 이미 수락한 생성 작업은 끝날 수 있다.
- 참여자 선택과 풀이 결과는 현재 화면 메모리에만 둔다. 새로고침하면 저장된 사주를 다시 선택해야 한다.

## 설정

Frontend는 기존 `.env.local`의 `NEXT_PUBLIC_API_BASE_URL`로 Backend에 접근하고 로그인 토큰을 자동 첨부한다. Kie 인증키는 **Backend `.env`**의 `KIE_API_KEY`에서만 읽는다. Backend `WEALTH_RANKING_ENABLED=true`로 활성화하고 서버를 재시작한다. 모델은 Backend `src/config/ai-model.config.ts`에서 변경한다.

상품 소개는 Backend의 상품 상세 API에서 이용 가능 여부를 조회한다. 비활성화되었거나 상태 조회에 실패하면 시작 버튼을 열지 않는다. 직접 시작 URL에 진입하더라도 최종 이용 가능 여부와 소유권은 Backend가 검증한다.

## 관련 파일과 검증

- `src/domains/wealth_ranking/model/use_wealth_ranking.ts`: 참여자 선택·저장·생성·오류·세션 수명 관리
- `src/domains/wealth_ranking/ui/`: 입력과 실제 결과 표시
- `src/entities/wealth_ranking/`: API와 응답 mapper
- `src/domains/reading_detail/ui/reading_detail_page.tsx`: 상품 이용 가능 여부 확인

```bash
pnpm test:wealth-ranking
pnpm lint
pnpm build
```

`test:wealth-ranking`은 기존 TypeScript compiler와 Node test runner로 mapper를 검증한다. 입력과 반대 순위, 동명이인, 시간 미상, 최대 인원, 누락·중복·타인 차트, 잘못된 결과를 포함한다. 추가 테스트 dependency는 없다. API의 인증·소유권·Provider 오류는 Backend E2E에서 검증한다.

브라우저에서 비로그인 리디렉션과 실제 서버의 활성 상품 상태·무료 시작 버튼을 확인했다. 로그인한 계정에서의 신규 사주 저장부터 결과까지 전체 흐름은 해당 계정의 정상 세션으로 확인해야 한다. 로컬 테스트를 위한 인증 우회나 공개 mock route는 추가하지 않는다.
