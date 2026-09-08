# Social authentication setup

현재 인증 범위는 카카오와 네이버 OAuth 로그인, Supabase 세션 유지, Backend
User 생성까지다. 자체 이메일/비밀번호 로그인은 제공하지 않는다.

## Runtime flow

```text
로그인 버튼
  -> Kakao 또는 Naver
  -> Supabase Auth callback
  -> Frontend /auth/callback
  -> PUT Backend /v1/users/me (Supabase access token)
  -> 앱 User 생성 또는 조회
  -> 원래 화면으로 이동
```

앱 User는 Supabase `auth.users`를 복제하지 않는다. Backend `users` 테이블에는
내부 `id`, Supabase JWT `sub`를 연결하는 `auth_subject`, 서비스에 표시할
`display_name`, 가입 상태와 감사용 일시만 저장한다. 이메일, provider user id,
access/refresh token은 저장하지 않는다.

새 User의 상태는 `pending_registration`이다. 약관과 만 14세 이상 동의 화면을
표시하고, 필수 확인이 완료되면 동의 버전과 시각을 `user_consents`에 기록한 뒤
`active`로 전환한다. 이용약관과 개인정보처리방침 전문 링크는 실제 문서 URL이
확정되면 연결한다.

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

## Naver

Naver는 Supabase built-in provider가 아니므로 Custom OAuth/OIDC provider로
등록한다.

1. Naver Developers에서 로그인 애플리케이션을 준비한다.
2. Callback URL은 Kakao와 동일한 Supabase callback을 등록한다.
3. Supabase Custom OAuth Providers에서 OIDC provider를 만들고 identifier를
   `naver`로 지정한다.
4. issuer/discovery URL은 `https://nid.naver.com`을 기준으로 설정하고 Naver
   client ID와 secret을 입력한다.
5. 이메일이 없는 계정을 허용하도록 설정한다.

Frontend에서 이 provider는 `custom:naver`로 호출한다. identifier를 다르게
설정하면 `src/features/auth/ui/social_login_buttons.tsx`의 provider 문자열도
같이 바꿔야 한다.

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
