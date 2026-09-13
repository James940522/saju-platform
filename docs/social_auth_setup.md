# Social authentication setup

현재 인증 범위는 카카오 OAuth 로그인, Supabase 세션 유지, 필수 가입 확인 후
Backend User 생성까지다. 자체 이메일/비밀번호 로그인은 제공하지 않는다.

## Runtime flow

```text
로그인 버튼
  -> Kakao
  -> Supabase Auth callback
  -> Frontend /auth/callback
  -> GET Backend /v1/users/me (Supabase access token, 10초 제한)
  -> 기존 앱 User 조회 (신규 사용자의 USER_NOT_FOUND는 정상)
  -> 원래 화면으로 이동
  -> 신규 사용자: 약관·개인정보·만 14세 이상 확인
  -> PUT Backend /v1/users/me/registration
  -> 앱 User와 동의 이력을 함께 저장하고 active로 전환
```

앱 User는 Supabase `auth.users`를 복제하지 않는다. Backend `users` 테이블에는
내부 `id`, Supabase JWT `sub`를 연결하는 `auth_subject`, 서비스에 표시할
`display_name`, 가입 상태와 감사용 일시만 저장한다. 이메일, provider user id,
access/refresh token은 저장하지 않는다.

앱 User가 없거나 `pending_registration`이면 가입 확인 화면을 표시한다.
필수 확인이 완료되면 동의 버전과 시각을 `user_consents`에 기록한 뒤
`active`로 전환한다. 가입 확인 화면의 이용약관과 개인정보처리방침 링크는 각각
`/terms`, `/privacy`로 같은 탭에서 이동하며, 가입 동의 창은 두 전문 페이지를
가리지 않는다. 링크로 이동할 때 원래 경로·검색 조건을 `returnTo`로 전달하고,
각 전문의 돌아가기 링크는 검증된 내부 경로만 사용한다. 루트 레이아웃의 가입
확인 상태는 페이지 이동 중 유지되어 돌아온 뒤 동의·연령 확인을 이어갈 수 있다.
이는 새로고침이나 새 탭을 넘는 상태 저장은 아니다.

동의 선택은 로그인 계정별로 분리하고 로그아웃 시 폐기한다. 회원정보 캐시도
인증 계정별로 구분한다. 회원정보 조회 중에는 대기 안내를, 실패하면 재시도와
계정 관리 링크를 표시하며 가입 확인을 건너뛰지 않는다. 모달은 브라우저 기본
`dialog.showModal()`을 사용해 배경 조작과 키보드 포커스 이탈을 막는다.
만 14세 미만 선택 후 취소하면 가입은 계속 차단되고, ‘확인하고 중지’를 누르면
로그아웃한다. 나이는 본인 확인 자료를 통한 검증이 아니라 이용자의 확인이다.

두 전문은 시행 전 초안이다. 운영 적용 전 시행일·미확정 정보·처리 조건을 확정하고
서버의 동의 버전과 맞춰야 한다. 개인정보처리방침 확인만으로 별도 동의가 필요한
모든 개인정보 처리의 요건이 충족되는 것은 아니다.

## Supabase project

1. Authentication URL Configuration의 Site URL을 로컬에서는
   `http://localhost:3000`으로 지정한다.
2. Redirect URLs에 `http://localhost:3000/auth/callback`을 추가한다.
3. 배포 환경의 origin과 `/auth/callback`도 별도로 추가한다.
4. Project URL과 publishable key를 Frontend와 Backend 환경변수에 넣는다.
5. Database pooled URL은 Backend `DATABASE_URL`, direct URL은 `DIRECT_URL`에
   넣고 Backend에서 `npm run prisma:migrate:deploy`를 실행한다.

## Kakao

1. Kakao Developers에서 애플리케이션과 Web platform을 준비한다.
2. Redirect URI에는 앱 callback이 아니라 다음 Supabase callback을 등록한다.

   ```text
   https://PROJECT_REF.supabase.co/auth/v1/callback
   ```

3. Supabase Authentication Providers의 Kakao에 REST API key와 필요한 secret을
   입력하고 활성화한다.
4. MVP에서는 이메일을 User 식별자로 사용하지 않으므로 이메일 없는 사용자도
   로그인할 수 있도록 설정한다.
5. 닉네임은 필수 동의로 설정하고 최초 로그인 시 `users.display_name`의 초기값으로
   저장한다. 프로필 사진은 실제 사용하기 전까지 요청하지 않는다.

## Local environment

Frontend `.env.local`:

```dotenv
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
NEXT_PUBLIC_SUPABASE_URL=https://PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_REPLACE_ME
```

Backend `.env`:

```dotenv
NODE_ENV=development
PORT=8080
CORS_ORIGINS=http://localhost:3000
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
SUPABASE_URL=https://PROJECT_REF.supabase.co
SUPABASE_PUBLISHABLE_KEY=sb_publishable_REPLACE_ME
```

실제 key, database password, OAuth client secret은 repository에 commit하지
않는다.
