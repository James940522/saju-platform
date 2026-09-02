# Saju Platform

한국 사주/운세 기반 모바일 중심 서비스의 프론트엔드 repository다.

서비스명은 아직 확정되지 않았으므로 `saju-platform`은 개발상 식별자로만 사용한다. 제품 방향과 작업 규칙은 아래 문서를 먼저 확인한다.

- `AGENTS.md`
- `docs/product_context.md`
- `docs/architecture.md`

## Stack

- Next.js 16
- React 19
- TypeScript
- App Router
- Tailwind CSS 4
- pnpm

## Project Structure

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

`src/app`은 Next.js App Router entry다. 전역 설정과 global style은 `src/application`, 실제 route 단위 화면 구현은 이후 `src/domains`를 중심으로 구성한다.

## Development

```bash
pnpm dev
pnpm lint
pnpm build
```

현재 단계에서는 실제 Backend, 인증, 결제, AI Provider, Database 연동을 구현하지 않는다.
