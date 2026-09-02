<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md

이 파일은 이 repository에서 작업하는 모든 AI coding agent의 기본 작업 규칙이다.

## Project Status

- 이 프로젝트는 한국 사주/운세 기반의 모바일 중심 프론트엔드 서비스다.
- 현재 서비스명은 확정되지 않았으므로 코드, 변수, 디렉터리, 문서에 특정 브랜드명을 강하게 결합하지 않는다.
- 현재 단계는 Frontend UI Development Phase다.
- 아직 실제 백엔드, 인증, 결제, AI Provider, 데이터베이스 연동을 구현하지 않는다.
- 현재 우선순위는 UI 완성, 화면 흐름 완성, 공통 컴포넌트 정리, 이후 백엔드 API 연결이다.

## Required Reading

코드를 작성하거나 구조를 변경하기 전에 반드시 다음을 확인한다.

1. `AGENTS.md`
2. `docs/product_context.md`
3. `docs/architecture.md`
4. 작업과 관련된 기존 코드
5. Next.js 관련 작업이라면 `node_modules/next/dist/docs/` 아래의 관련 가이드

Next.js는 현재 `16.3.4`를 사용한다. 학습된 과거 Next.js 지식만으로 판단하지 말고, 로컬 문서를 기준으로 한다.

## Product Boundaries

Frontend의 책임은 다음으로 제한한다.

- 화면 렌더링
- 사용자 입력
- 사용자 인터랙션
- 백엔드 API 호출
- 백엔드 응답 표시

Frontend에 다음을 넣지 않는다.

- 중요한 비즈니스 로직
- 인증/인가 판단의 최종 책임
- 결제 검증
- 데이터베이스 직접 접근
- AWS credential
- 민감한 secret
- LLM API secret
- 사주 해석 생성 로직

사주 데이터 처리, AI 기반 해석 생성, 결제 검증, Presigned URL 발급은 백엔드 책임으로 둔다.

## Architecture

Frontend는 Feature-Sliced Design(FSD)을 사용한다.

기본 구조는 다음을 따른다.

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

이 프로젝트에서는 Next.js App Router의 `src/app`을 라우팅 진입점으로 사용한다.

FSD의 App Layer 성격 중 전역 설정, provider, global style은 `application`에서 관리한다.

Next.js의 `pages` directory와 혼동하지 않기 위해 FSD Pages Layer 성격의 페이지 특화 코드는 `domains`라는 이름을 사용한다. 여기서 `domains`는 business entity가 아니라 route/page별 캡슐화 영역을 의미한다.

Layer 책임은 다음과 같다.

- `app`: Next.js routing entry, route segment, layout, page
- `application`: provider, global style, global configuration, application initialization
- `domains`: 하나의 route를 구성하는 페이지 특화 코드 집합
- `widgets`: 여러 feature/entity를 조합한 큰 독립 UI block
- `features`: 사용자의 행동과 use case
- `entities`: 핵심 domain model
- `shared`: business domain에 종속되지 않는 공통 UI, utility, configuration, common library

FSD dependency 방향은 반드시 아래 흐름을 따른다.

```text
app -> application
app -> domains -> widgets -> features -> entities -> shared
application -> shared
```

허용 예:

- `app` -> `application`
- `app` -> `domains`
- `domains` -> `widgets`
- `features` -> `entities`
- `features` -> `shared`
- `widgets` -> `features`
- `widgets` -> `entities`

금지 예:

- `shared` -> `entities`
- `shared` -> `features`
- `entities` -> `features`
- `features` -> `widgets`
- `widgets` -> `domains`
- `application` -> `domains`

Slice 외부에서 내부 구현 파일에 직접 접근하지 않는다. 필요한 경우 slice의 public API를 통해 접근한다.

## Import Rules

- `@/*` alias를 사용해 `src/*`를 참조한다.
- 깊은 relative import를 피한다.
- 동일 slice 내부에서는 상대 경로를 사용할 수 있다.
- 다른 slice를 참조할 때는 해당 slice의 public API를 통해 import한다.

권장:

```ts
import { BirthDateForm } from "@/features/saju_input";
```

지양:

```ts
import { BirthDateForm } from "@/features/saju_input/ui/birth_date_form";
```

## Public API Rules

- `index.ts`는 FSD slice의 public API를 정의할 때만 사용한다.
- 모든 directory에 습관적으로 `index.ts`를 생성하지 않는다.
- 외부 layer 또는 slice에서 필요한 항목만 export한다.
- 내부 구현 파일을 불필요하게 공개하지 않는다.

예:

```text
features/
  saju_input/
    ui/
      birth_date_form.tsx
    model/
    index.ts
```

```ts
export { BirthDateForm } from "./ui/birth_date_form";
```

## FSD Segment Convention

Slice 내부에서는 필요한 경우 다음 segment 이름을 우선 사용한다.

- `ui`: React Component
- `model`: state, hook, domain state logic
- `api`: API access
- `lib`: 해당 slice 전용 utility
- `config`: configuration

필요하지 않은 segment는 미리 생성하지 않는다.

`components`, `hooks`, `utils`, `services` 같은 임의의 segment를 기존 규칙과 중복해서 생성하지 않는다.

## Next.js Rules

- App Router를 사용한다.
- `src/app`의 `page.tsx`는 routing entry 역할을 하도록 얇게 유지한다.
- 실제 화면 구성은 가능한 한 `src/domains` 아래에서 관리한다.
- Server Component를 기본으로 한다.
- event handler, browser API, client state, React client hook이 실제 필요한 경우에만 Client Component를 사용한다.
- `"use client"`를 page 최상단에 습관적으로 추가하지 않는다.
- Client Component 범위는 가능한 작게 유지한다.
- 내부 navigation은 `next/link`를 우선한다.
- 이미지는 `next/image` 사용을 우선한다.
- Next.js framework convention을 임의로 우회하지 않는다.
- 라우트로 공개되어야 하는 파일만 `page.tsx` 또는 `route.ts`로 만든다.

## Frontend Stack

- Next.js
- React
- TypeScript
- App Router
- Tailwind CSS
- pnpm

현재 단계에서 필요하지 않은 dependency를 추가하지 않는다. 특히 필요성이 명확하지 않은 상태에서 다음을 임의로 설치하지 않는다.

- Zustand
- Redux
- React Query
- Axios
- UI Component Library

새 package를 추가하기 전에 다음을 먼저 확인한다.

- 정말 필요한가?
- browser, React, Next.js 기본 기능으로 해결 가능한가?
- 이미 프로젝트에 같은 목적의 dependency가 존재하는가?

## Naming Convention

- React Component 이름: `PascalCase`
- Component filename: `snake_case`
- 변수: `camelCase`
- 함수: `camelCase`
- React Hook: `use` prefix를 붙인 `camelCase`
- Type/Interface: `PascalCase`
- 상수: `UPPER_SNAKE_CASE`
- Boolean: 가능한 한 `is`, `has`, `can`, `should` prefix 사용
- Event Handler: `handle` prefix 사용

예:

- `SajuResultCard`
- `saju_result_card.tsx`
- `useBirthDate`
- `handleSubmit`
- `MAX_RETRY_COUNT`
- `isLoading`

## File Naming

- React Component file: `snake_case`
- 일반 TypeScript file: `snake_case`
- Hook file: `snake_case`
- 변수, 함수, hook identifier: `camelCase`
- Next.js framework special file은 Next.js convention을 그대로 따른다.
- URL route segment는 가독성을 위해 `kebab-case` 또는 단일 영문 단어를 사용한다.

## Component Rules

- React Component는 하나의 명확한 책임을 갖도록 한다.
- 반복되지 않은 UI를 성급하게 추상화하지 않는다.
- 실제 반복 패턴이 확인되었을 때 공통 컴포넌트로 추출한다.
- 단순히 `div` 하나를 감싸기 위한 component를 만들지 않는다.
- `BaseWrapper`, `CommonWrapper`, `ContentWrapper`, `SectionContainerWrapper` 같은 의미 없는 abstraction을 만들지 않는다.
- UI와 business logic을 가능한 한 분리한다.
- Page Component가 지나치게 커지면 의미 있는 UI 단위로 분리한다.
- 파일 줄 수만을 기준으로 무조건 Component를 분리하지 않는다.

## TypeScript Rules

- TypeScript strict typing을 유지한다.
- `any` 사용을 금지한다.
- `unknown`으로 해결 가능한 문제에 `any`를 사용하지 않는다.
- Props type은 명확하게 선언한다.
- 불필요한 type assertion을 사용하지 않는다.
- API response type과 UI domain type을 무조건 동일하게 취급하지 않는다.
- magic string과 magic number를 남발하지 않는다.

## React Rules

- 불필요한 `useEffect`를 사용하지 않는다.
- derived state를 state로 중복 관리하지 않는다.
- React state가 필요하지 않은 값은 일반 변수로 처리한다.
- 무조건적인 `useMemo`/`useCallback` 최적화를 하지 않는다.
- 참조 안정성이나 성능 이슈가 실제로 있을 때만 memoization을 사용한다.
- props drilling이 약간 있다는 이유만으로 global state를 도입하지 않는다.
- React 기본 기능으로 해결 가능한 문제에 추가 library를 도입하지 않는다.

## Styling Rules

- Tailwind CSS를 기본 styling 방식으로 사용한다.
- Mobile First로 구현한다.
- 주요 사용 환경은 모바일이다.
- 모바일 디자인을 먼저 정확하게 구현하고 이후 tablet/desktop으로 확장한다.
- 동일한 spacing, typography, color, radius가 반복되면 design token으로 관리하는 것을 고려한다.
- 디자인 reference가 있다면 Visual Source of Truth로 취급한다.
- 디자인 reference에 없는 gradient, shadow, animation, glassmorphism, decorative icon, decorative background를 임의로 추가하지 않는다.
- inline style은 특별한 이유가 없는 한 사용하지 않는다.

## Design Fidelity

디자인 reference가 제공된 UI 작업에서는 "더 좋아 보인다", "더 현대적이다", "UX에 더 적합하다"는 이유로 레이아웃, 문구, 색상, 간격, 구성요소를 임의로 변경하지 않는다.

디자인 reference와 구현 가능성이 충돌하는 경우 임의로 결정하지 않고 차이점을 작업 결과에 명시한다.

## Form Rules

- form은 semantic `<form>`을 사용한다.
- submit은 `onClick`보다 form의 `onSubmit` 흐름을 우선한다.
- 입력값 검증 메시지는 사용자에게 명확하게 표시한다.
- 같은 값을 React state와 DOM form state에 중복 저장하지 않는다.
- 현재 단계에서는 필요성이 확인되기 전까지 form library를 추가하지 않는다.
- validation library도 실제 요구사항이 생기기 전까지 임의로 설치하지 않는다.

## Accessibility

- Semantic HTML을 우선한다.
- 클릭 가능한 UI에 `div`를 사용하지 않는다.
- button 행동은 `button`을 사용한다.
- form element에는 적절한 label을 제공한다.
- 필요한 경우 aria attribute를 사용한다.
- Keyboard navigation을 깨뜨리지 않는다.

## Mock Data

- Mock data는 UI 흐름 확인을 위한 임시 데이터로만 둔다.
- Mock data 구조를 실제 API 계약으로 단정하지 않는다.
- 이후 백엔드 API로 교체하기 쉬운 형태로 작성한다.
- 인증, 결제, AI 연동, DB 연동을 mock이라는 이름으로 실제처럼 구현하지 않는다.

## Change Scope

- 사용자의 요구사항에 없는 기능을 임의로 추가하지 않는다.
- 새로운 architecture나 pattern을 임의로 도입하지 않는다.
- 기존 pattern과 현재 문서의 규칙을 우선한다.
- 작업 범위를 넘어선 대규모 refactoring을 하지 않는다.
- 기존 코드에 문제가 발견되더라도 현재 task와 관계없는 경우 먼저 설명하고 임의 수정하지 않는다.

## Quality Check

작업 완료 후 가능한 경우 반드시 실행한다.

```bash
pnpm lint
pnpm build
```

오류가 있다면 원인을 해결한다. Type error를 숨기기 위해 `any`, `@ts-ignore`, `eslint-disable`을 임의로 사용하지 않는다.

완료 보고에는 다음을 간략히 포함한다.

- 변경 파일
- 구현 내용
- 주요 설계 판단
- lint 결과
- build 결과
