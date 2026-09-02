# Architecture

## Current Repository Snapshot

현재 repository는 Next.js 기반 프론트엔드 앱이다.

- Package manager: `pnpm`
- Framework: `next@16.3.4`
- React: `19.2.8`
- Language: TypeScript
- Styling: Tailwind CSS 4
- Routing: Next.js App Router
- Source root: `src`

현재 실제 서비스 UI는 아직 구현하지 않는다. 기존 create-next-app 기본 화면은 초기 placeholder로만 취급한다.

## Target System Architecture

서비스 전체 방향은 다음과 같다.

```text
Client
  -> Frontend: Next.js on Vercel
  -> HTTPS API
  -> Backend: NestJS on AWS Lightsail
  -> ORM: Prisma
  -> Database: Supabase PostgreSQL
```

파일 업로드는 다음 흐름을 기본 방향으로 한다.

```text
Client
  -> Backend에서 Presigned URL 발급
  -> Client가 AWS S3에 직접 업로드
```

Frontend는 AWS credential, database credential, LLM API secret, 결제 검증 secret을 갖지 않는다.

## Frontend Responsibilities

Frontend는 다음을 담당한다.

- 화면 렌더링
- 사용자 입력
- 사용자 인터랙션
- Backend API 호출
- Backend 응답 표시
- 모바일 중심 responsive UI
- 화면 흐름과 공통 컴포넌트 구성

Frontend는 다음을 담당하지 않는다.

- 중요한 비즈니스 로직
- 인증/인가 판단의 최종 책임
- 결제 검증
- 데이터베이스 직접 접근
- Presigned URL 생성
- AI Provider 직접 연동
- 사주 해석 생성

## Backend Responsibilities

Backend는 향후 다음을 담당한다.

- 인증/인가
- 비즈니스 로직
- 데이터 검증
- DB 접근
- 외부 서비스 연동
- AI Provider 연동
- 결제 검증
- Presigned URL 발급

현재 repository에서는 Backend를 구현하지 않는다.

## Frontend Folder Architecture

Frontend architecture는 Feature-Sliced Design(FSD)을 사용한다.

```text
src/
  app/
  application/
  domains/
  widgets/
  features/
  entities/
  shared/
```

Layer 책임은 다음과 같다.

- `src/app`: Next.js routing entry, route segment, layout, page
- `src/application`: provider, global style, global configuration, application initialization
- `src/domains`: route/page별 페이지 특화 코드 집합
- `src/widgets`: 여러 feature/entity를 조합한 독립 UI block
- `src/features`: 사용자 행동과 use case
- `src/entities`: 핵심 domain model
- `src/shared`: business domain에 종속되지 않는 공통 코드

Next.js의 `pages` directory와 혼동하지 않기 위해 FSD Pages Layer 성격의 코드는 `domains`라고 부른다. 여기서 `domains`는 business entity가 아니라 route/page별 캡슐화 영역을 의미한다.

## Dependency Direction

FSD dependency 방향은 다음을 따른다.

```text
app -> application
app -> domains -> widgets -> features -> entities -> shared
application -> shared
```

하위 Layer가 상위 Layer를 import하면 안 된다.

허용 예:

- `app` -> `application`
- `app` -> `domains`
- `domains` -> `widgets`
- `widgets` -> `features`
- `features` -> `entities`
- `features` -> `shared`
- `entities` -> `shared`

금지 예:

- `shared` -> `entities`
- `entities` -> `features`
- `features` -> `widgets`
- `widgets` -> `domains`
- `application` -> `domains`

Slice 외부에서 내부 구현 파일을 직접 import하지 않는다. 다른 Layer나 Slice에서 사용해야 하는 항목은 해당 Slice의 public API를 통해 노출한다.

## Next.js App Router Rules

- App Router는 `src/app` 아래에 둔다.
- `page.tsx`는 route entry로 얇게 유지한다.
- 실제 route UI는 가능한 한 `src/domains`에서 구성한다.
- Server Component를 기본값으로 사용한다.
- Client Component는 event handler, browser API, client state, React client hook이 필요한 곳에만 사용한다.
- `"use client"` boundary는 최대한 작은 단위에 둔다.
- route로 공개되어야 할 때만 `page.tsx` 또는 `route.ts`를 추가한다.
- 내부 navigation은 `next/link`를 우선한다.
- 이미지는 `next/image`를 우선한다.

## Import Alias

`@/*`는 `src/*`를 가리킨다.

예:

```ts
import { HomeDomain } from "@/domains/home";
```

상대 경로가 더 명확한 가까운 파일에는 상대 import를 사용할 수 있다. 여러 계층을 거슬러 올라가는 import가 반복되면 `@/*` alias를 우선 고려한다.

## Data and API Strategy

현재 단계에서는 실제 API client를 과도하게 만들지 않는다.

화면 구현 중 mock data가 필요하면 해당 화면 또는 feature에 가까운 위치에 작게 둔다. 이후 API 계약이 확정되면 다음을 분리해서 판단한다.

- API response type
- domain model type
- view model type
- formatting/normalization helper

AI Provider 응답 구조는 UI에 직접 노출하지 않는다. Backend가 Provider별 차이를 흡수하고, Frontend는 서비스 도메인에 맞는 응답을 표시하는 것을 목표로 한다.

## Styling

Tailwind CSS를 기본 styling 방식으로 사용한다.

모바일을 먼저 구현하고 tablet/desktop으로 확장한다. 디자인 reference가 제공되면 reference를 Visual Source of Truth로 취급한다.

반복되는 spacing, typography, color, radius가 확인되기 전에는 design token을 성급하게 늘리지 않는다.

## Dependency Policy

현재 dependency는 최소 상태를 유지한다.

필요성이 명확하지 않은 상태에서 다음을 추가하지 않는다.

- Zustand
- Redux
- React Query
- Axios
- UI Component Library

새 dependency는 실제 요구사항, 기존 기능으로 해결 가능 여부, bundle impact를 확인한 뒤 도입한다.

## Quality Gates

작업 완료 후 가능한 경우 다음을 실행한다.

```bash
pnpm lint
pnpm build
```

오류를 숨기기 위한 `any`, `@ts-ignore`, `eslint-disable`은 사용하지 않는다.
