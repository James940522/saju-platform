# Design Tokens

프로젝트의 색상과 radius, font, shadow의 source of truth는
`src/application/styles/globals.css`다. shadcn 컴포넌트도 이 파일의 CSS
variable을 사용하므로 컴포넌트마다 색상을 다시 지정하지 않는다.

## 기본 원칙

- 일반 UI와 shadcn 컴포넌트는 의미 기반 token을 먼저 사용한다.
- 브랜드 금색 장식이 실제로 필요한 경우에만 `brand-gold-*` token을 사용한다.
- `muted`는 옅은 배경이고, 보조 문구는 `muted-foreground`다.
- `accent`는 hover, focus, selected 상태의 옅은 배경이다. 금색 선이나 장식에는
  `brand-gold`를 사용한다.
- 임의의 hex color를 추가하기 전에 기존 token으로 표현할 수 있는지 확인한다.

## 자주 쓰는 Tailwind utility

| 목적 | utility 예시 |
| --- | --- |
| 앱 배경과 기본 글자 | `bg-background text-foreground` |
| 카드 | `bg-card text-card-foreground border-border` |
| 팝오버/메뉴 | `bg-popover text-popover-foreground` |
| 주요 액션 | `bg-primary text-primary-foreground` |
| 보조 액션 | `bg-secondary text-secondary-foreground` |
| 옅은 영역과 보조 문구 | `bg-muted text-muted-foreground` |
| hover/선택 상태 | `bg-accent text-accent-foreground` |
| 입력 테두리와 focus | `border-input focus-visible:ring-ring` |
| 오류 | `bg-destructive-soft text-destructive` |
| 금색 장식 | `border-brand-gold bg-brand-gold-soft` |
| 남색 hero | `bg-hero text-hero-foreground` |
| hero 위 금색 강조 | `text-hero-accent` 또는 `text-brand-gold-on-dark` |

오행 색은 `element-wood`, `element-fire`, `element-earth`,
`element-metal`, `element-water`와 각각의 `-soft` token을 사용한다.

## shadcn 컴포넌트 추가

`components.json`의 alias가 FSD의 `shared` layer를 가리키므로 다음 명령으로
추가한 컴포넌트는 `src/shared/ui`에 생성된다.

```bash
pnpm exec shadcn add input
```

다른 slice에서 사용할 컴포넌트만 `src/shared/ui/index.ts`에 export한다.
생성된 컴포넌트의 `primary`, `secondary`, `muted`, `accent`, `ring` 색상은
프로젝트 token에 자동으로 연결된다.
