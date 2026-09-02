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
- `application`: App Shell, provider, global style, global configuration, application initialization
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
- 기본 UI는 Mobile App Shell 형태를 유지하며, 큰 화면에서도 앱 콘텐츠가 무한정 넓어지지 않도록 한다.
- 서비스 전체 App width/container 정책은 개별 page가 아니라 application/global layout에서 관리한다.
- 모바일 디자인을 먼저 정확하게 구현하고 이후 tablet/desktop으로 확장한다.
- 동일한 spacing, typography, color, radius가 반복되면 design token으로 관리하는 것을 고려한다.
- 디자인 reference가 있다면 Visual Source of Truth로 취급한다.
- 디자인 reference에 없는 gradient, shadow, animation, glassmorphism, decorative icon, decorative background를 임의로 추가하지 않는다.
- inline style은 특별한 이유가 없는 한 사용하지 않는다.

## Mobile Layout Rules

이 서비스는 Mobile First가 아니라 사실상 Mobile App First에 가깝게 설계한다.

주요 사용자 경험은 모바일 화면을 기준으로 하며, Tablet/Desktop에서도 콘텐츠 자체가 넓게 확장되는 일반적인 반응형 웹 형태를 기본으로 하지 않는다.

### App Shell

서비스 전체 UI는 하나의 Mobile App Shell 안에서 동작하는 구조를 기본으로 한다.

기본 원칙:

- 모바일에서는 viewport 전체 너비를 사용한다.
- 전체 화면 높이는 `100dvh`를 기준으로 한다.
- 큰 화면에서는 모바일 앱 영역을 화면 중앙에 배치한다.
- 앱 콘텐츠 최대 너비는 기본적으로 약 `430px`을 기준으로 한다.
- App Shell의 최대 너비는 이후 쉽게 변경할 수 있는 형태로 관리한다.
- Desktop에서 앱 콘텐츠를 임의로 넓혀 2-column, 3-column layout으로 변경하지 않는다.
- 페이지마다 `max-width` 또는 동일한 container width를 반복해서 선언하지 않는다.
- 서비스 전체 폭과 기본 레이아웃은 App Shell에서 일관되게 관리한다.
- horizontal overflow가 발생하지 않도록 한다.

개념적인 화면 구조:

```text
Mobile

┌──────────────────────┐
│                      │
│      Application     │
│                      │
│                      │
└──────────────────────┘


Tablet / Desktop

██████████████████████████████
██████ ┌────────────────┐ █████
██████ │                │ █████
██████ │  Application   │ █████
██████ │                │ █████
██████ └────────────────┘ █████
██████████████████████████████
```

Desktop의 외부 영역과 실제 App Surface는 구분할 수 있으나, 디자인 reference에 없는 과도한 shadow, border, decoration을 임의로 추가하지 않는다.

## Application Layout Responsibility

전체 서비스 공통 layout과 global UI foundation은 `application` Layer에서 관리한다.

예:

```text
src/
  app/
    layout.tsx

  application/
    ui/
      app_shell.tsx
```

`src/app/layout.tsx`는 Next.js root layout 및 routing entry 역할을 유지하고, 실제 서비스 공통 App Shell이 필요하다면 `application` Layer의 UI를 조합한다.

예:

```tsx
<AppShell>
  {children}
</AppShell>
```

다음 값은 각 route 또는 domain에서 중복 정의하지 않고 가능한 한 application/global level에서 일관되게 관리한다.

- App maximum width
- global background
- App surface
- minimum viewport height
- safe area
- 기본 typography
- global color token
- global radius token
- global spacing 원칙

단순히 layout을 감싸기 위한 의미 없는 Wrapper Component를 여러 단계로 생성하지 않는다.

## Safe Area Rules

iOS를 포함한 모바일 브라우저 환경을 고려한다.

필요한 영역에서는 다음 값을 사용할 수 있도록 한다.

```css
env(safe-area-inset-top)
env(safe-area-inset-right)
env(safe-area-inset-bottom)
env(safe-area-inset-left)
```

다음 UI가 기기의 notch, Dynamic Island, Home Indicator 등에 가려지지 않도록 한다.

- Header
- Bottom Navigation
- Fixed CTA
- Bottom Sheet
- Fixed Footer

Safe Area 값을 모든 component에서 제각각 처리하지 않는다.

반복되는 경우 global token 또는 공통 layout 수준에서 처리한다.

## Scroll Rules

기본적인 페이지 scroll은 browser/document scroll을 우선한다.

특별한 UX 요구사항이 없다면 App Shell 내부에 별도의 전체 화면 scroll container를 만들지 않는다.

다음과 같은 구조를 습관적으로 만들지 않는다.

```text
body
  overflow-hidden

AppShell
  h-dvh
  overflow-y-auto
```

별도의 scroll container는 실제로 필요한 경우에만 사용한다.

Fixed Header 또는 Bottom Navigation을 사용할 경우:

- 콘텐츠가 navigation 뒤에 가려지지 않아야 한다.
- 필요한 padding을 고려한다.
- Safe Area를 함께 고려한다.
- scroll behavior를 불필요하게 복잡하게 만들지 않는다.

## Global Design Foundation

실제 페이지 UI 구현 전에 최소한의 global design foundation을 사용할 수 있다.

초기 global token은 필요한 값만 정의한다.

예:

- background
- foreground
- surface
- primary
- muted
- border
- app maximum width
- 기본 radius
- 기본 typography

CSS Variable과 Tailwind CSS를 적절히 조합할 수 있다.

예:

```css
:root {
  --app-max-width: 430px;

  --background: ...;
  --foreground: ...;
  --surface: ...;
  --primary: ...;
  --muted: ...;
  --border: ...;
}
```

단, 실제 디자인에서 사용되지 않는 token을 미래 사용 가능성만으로 대량 생성하지 않는다.

다음과 같은 과도한 token system을 초기에 만들지 않는다.

- 수십 단계의 spacing token
- 사용되지 않는 color palette 전체
- 사용되지 않는 elevation system
- 사용되지 않는 animation token
- 사용되지 않는 component-specific token

실제 UI에서 반복되는 패턴이 확인된 뒤 필요한 token을 추가한다.

## Global CSS Rules

`globals.css`는 application 전체에서 실제로 공통인 style만 관리한다.

포함할 수 있는 항목:

- CSS variables
- 기본 reset
- `box-sizing`
- body margin
- 기본 background / foreground
- font smoothing
- 기본 typography
- horizontal overflow 방지
- global App Shell 관련 foundation

특정 page나 feature에만 필요한 style을 `globals.css`에 넣지 않는다.

특정 domain의 UI style이 global CSS에 누적되지 않도록 한다.

## Responsive Rules

Responsive UI는 Mobile First 방식으로 작성한다.

기본 순서:

```text
Mobile
→ Tablet
→ Desktop
```

단, 이 프로젝트에서 Desktop은 별도의 Desktop Service UI를 의미하지 않는다.

기본적으로:

```text
0px ~ App Max Width
→ viewport 전체 사용

App Max Width 이상
→ App Shell의 폭 유지
→ 화면 중앙 정렬
```

형태를 사용한다.

Desktop이라는 이유만으로 다음과 같은 변경을 임의로 하지 않는다.

- 카드 여러 열 배치
- Sidebar 추가
- Navigation 구조 변경
- 콘텐츠 폭 대폭 확대
- Mobile flow를 Desktop dashboard 형태로 변경

별도의 Desktop UX가 디자인 reference로 제공된 경우에만 적용한다.

## Fixed UI Rules

Header, Bottom Navigation, Fixed CTA 등 화면에 고정되는 UI는 실제 디자인에서 필요한 경우에만 구현한다.

현재 필요하지 않은 다음 component를 App Shell을 구성한다는 이유만으로 미리 만들지 않는다.

- Header
- Bottom Navigation
- Floating Button
- Modal
- Drawer
- Bottom Sheet
- Toast

실제 화면 구현 과정에서 필요성이 확인되면 적절한 FSD Layer에 추가한다.

## Design Reference

현재 서비스의 모바일 UI 및 UX 방향은 아래 서비스를 주요 reference 중 하나로 사용한다.

- [https://doryeong.app/](https://doryeong.app/)

해당 서비스의 다음 특성을 참고할 수 있다.

- 모바일 중심 화면 구성
- 콘텐츠 영역의 폭
- 페이지 hierarchy
- Header / Navigation 배치 방식
- 카드 및 section 간 간격
- 모바일 앱과 유사한 웹 UX
- Desktop에서 모바일 영역을 유지하는 방식

단, reference는 Product Context와 사용자가 제공한 구체적인 디자인 요구사항보다 우선하지 않는다.

Reference를 참고한다는 이유로 다음을 그대로 복제하지 않는다.

- 서비스 문구
- 브랜드명
- 이미지
- icon
- 콘텐츠
- business logic

사용자가 screenshot 또는 구체적인 UI reference를 제공한 경우 해당 자료를 Visual Source of Truth로 취급한다.

## Design Reference Priority

UI 구현 시 디자인 판단의 우선순위는 다음과 같다.

```text
1. 사용자가 현재 작업에서 직접 제공한 screenshot / design
2. 사용자가 현재 작업에서 명시한 요구사항
3. docs/product_context.md
4. 프로젝트의 기존 UI pattern
5. 지정된 reference service
6. coding agent의 자체적인 디자인 판단
```

상위 기준과 하위 기준이 충돌할 경우 상위 기준을 따른다.

Coding agent의 자체적인 디자인 판단은 최후의 수단으로만 사용한다.

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
