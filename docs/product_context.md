# Product Context

## Overview

이 repository는 한국의 사주/운세를 기반으로 하는 모바일 중심 서비스의 프론트엔드다.

서비스명은 아직 확정되지 않았다. 따라서 코드, 변수명, architecture, 문서 구조는 특정 브랜드명에 강하게 결합하지 않는다. 현재 repository 이름인 `saju-platform`은 개발상 식별자로만 취급한다.

## Target Experience

주요 사용 환경은 모바일이다. 사용자는 자신의 생년월일, 출생시간 등 사주 정보를 입력하고, 사주 보기와 AI 기반 해석, 운세 콘텐츠, 유료 콘텐츠, 기도초 신청, 결제, 마이페이지, 이용내역/결제내역, 공유 기능을 이용하게 될 예정이다.

본인뿐 아니라 가족이나 지인을 위한 기도 신청도 고려한다.

## Planned Capabilities

- 회원가입/로그인
- 사용자 사주 정보 관리
- 사주 보기
- AI 기반 사주 해석
- 운세 콘텐츠
- 유료 콘텐츠
- 기도초 신청
- 가족/지인을 위한 기도 신청
- 결제
- 마이페이지
- 이용내역 및 결제내역 관리
- 공유 기능

## Product Principles

- 모바일 사용성을 먼저 완성한다.
- 실제 서비스 UI는 일관된 화면 흐름과 공통 컴포넌트 체계를 기반으로 구현한다.
- 브랜드명이 정해지기 전까지는 기능, 도메인, 사용자 행동 중심의 이름을 사용한다.
- AI Provider는 교체될 수 있으므로 UI를 특정 Provider의 응답 구조나 명칭에 강하게 결합하지 않는다.
- 사주 해석은 프론트엔드에서 계산하거나 생성하지 않는다.
- 프론트엔드는 백엔드 응답을 표시하고 사용자 입력과 인터랙션을 담당한다.

## Current Phase

현재는 Frontend UI Development Phase다.

우선순위는 다음과 같다.

1. Frontend UI 완성
2. 화면 흐름 완성
3. 공통 컴포넌트 정리
4. 이후 Backend API 연결
5. 인증, 결제, 실제 비즈니스 로직 연결

현재 단계에서는 API가 존재한다고 가정한 과도한 구조를 만들지 않는다.

## Out of Scope for Now

다음은 현재 단계에서 구현하지 않는다.

- 실제 인증/인가
- 결제 검증
- Backend API 구현
- Database 연동
- Prisma schema 작성
- Supabase 연결
- AWS credential 또는 S3 직접 연동
- LLM API 직접 호출
- AI Provider별 SDK 연결
- 실제 사주 계산 또는 해석 생성 로직

## Mock Data Policy

Mock data가 필요한 경우 UI 흐름 확인을 위한 임시 데이터로만 사용한다.

Mock data의 shape을 실제 API 계약으로 단정하지 않는다. 이후 Backend API 응답과 domain model 사이에 필요한 변환 계층을 둘 수 있도록 작성한다.
