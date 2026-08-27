<!--
역할: 프로젝트의 모든 추적 파일이 담당하는 책임과 필요한 이유를 한눈에 정리하는 색인입니다.
필요한 이유: 파일을 처음 보는 학습자가 어디부터 읽을지 판단하고, 인라인 주석을 넣을 수 없는 바이너리 자산도 이해하게 합니다.
-->

# 파일 역할 색인

대부분의 텍스트 파일에는 같은 내용을 맨 위 주석으로 넣었습니다. 다음 두 파일은 형식상 예외라 이 문서가 주석 역할을 대신합니다.

- `.openai/hosting.json`: Sites가 `project_id`, `d1`, `r2`만 저장하도록 요구하는 배포 설정이라 설명 필드를 추가하지 않습니다.
- `public/og.png`: 이미지 바이너리라 코드 주석을 저장할 수 없습니다.

| 파일 | 역할 | 필요한 이유 |
| --- | --- | --- |
| `README.md` | 학습용 개발 화면 시작 안내 | 비전공자가 자동 반영 서버와 첫 수정을 바로 시작하게 합니다. |
| `.gitignore` | Git 제외 규칙 | 의존성·빌드 결과·로컬 설정이 소스 기록에 섞이지 않게 합니다. |
| `.openai/hosting.json` | Sites 프로젝트 및 저장소 자원 연결 | 올바른 사이트와 D1/R2 사용 여부를 배포 서비스에 알려 줍니다. |
| `app/globals.css` | 전역 테마와 반응형 스타일 | 모든 화면이 같은 디자인 토큰과 레이아웃 규칙을 공유하게 합니다. |
| `app/layout.tsx` | 루트 문서, 폰트, 메타데이터 | 모든 페이지의 공통 설정과 공유 미리보기를 한곳에서 관리합니다. |
| `app/page.tsx` | 대시보드 화면과 상호작용 | `/`에서 사용자가 보는 모든 핵심 기능을 조립합니다. |
| `components.json` | shadcn 생성 규칙 | CLI가 현재 스타일과 import 경로에 맞춰 컴포넌트를 추가하게 합니다. |
| `components/ui/avatar.tsx` | 사용자 이미지와 대체 문자 | 사람을 구분하고 이미지 실패에도 정보를 유지합니다. |
| `components/ui/badge.tsx` | 작은 상태·개수 라벨 | 부가 정보를 낮은 시각적 위계로 표시합니다. |
| `components/ui/breadcrumb.tsx` | 계층형 이동 경로 | 화면이 확장될 때 현재 위치와 상위 경로를 알려 줍니다. |
| `components/ui/button.tsx` | 공용 버튼 변형 | 모든 동작에 같은 크기, 상태와 접근성을 적용합니다. |
| `components/ui/card.tsx` | 콘텐츠 패널 표면 | KPI·차트·표를 동일한 공간 규칙으로 묶습니다. |
| `components/ui/dropdown-menu.tsx` | 키보드 접근 가능한 메뉴 | 여러 보조 명령을 좁은 공간에 정리할 수 있습니다. |
| `components/ui/input.tsx` | 공용 입력 요소 | 검색 입력의 스타일과 포커스 표현을 일관되게 합니다. |
| `components/ui/progress.tsx` | 비율 진행 막대 | 국가별 수치를 길이로 빠르게 비교하게 합니다. |
| `components/ui/separator.tsx` | 의미 있는 구분선 | 확장 화면에서 콘텐츠 그룹을 일관되게 나눕니다. |
| `components/ui/sheet.tsx` | 가장자리 임시 패널 | 모바일 메뉴나 설정 패널의 대체 구현에 사용합니다. |
| `components/ui/table.tsx` | 시맨틱 데이터 표 | 거래 데이터의 행·열 관계와 접근성을 유지합니다. |
| `components/ui/tooltip.tsx` | 짧은 보조 설명 | 아이콘 중심 UI에 추가 맥락을 제공할 수 있습니다. |
| `docs/DASHBOARD_STUDY_GUIDE.md` | 구현 학습 문서 | shadcn, 레이아웃, 차트와 상태 관리 원리를 복습하게 합니다. |
| `docs/FILE_ROLES.md` | 파일 역할 색인 | 프로젝트 구조를 빠르게 탐색하고 바이너리 파일까지 설명합니다. |
| `eslint.config.mjs` | 코드 검사 규칙 | 실행 전에 오류와 일관성 문제를 찾습니다. |
| `lib/utils.ts` | Tailwind 클래스 결합 유틸리티 | 조건부 스타일을 합치고 충돌을 정리합니다. |
| `next.config.ts` | Next.js 중앙 설정 | 향후 프레임워크 옵션을 추가할 표준 위치를 제공합니다. |
| `package.json` | 명령과 직접 의존성 선언 | npm이 개발·빌드·설치 방법을 이해하게 합니다. |
| `package-lock.json` | 정확한 의존성 버전 잠금 | 환경마다 동일한 패키지 트리를 재현합니다. |
| `public/favicon.svg` | 브라우저 탭 아이콘 | 여러 탭 사이에서 사이트를 식별하게 합니다. |
| `public/og.png` | SNS·메신저 공유 이미지 | 링크 공유 시 대시보드 브랜드와 내용을 시각적으로 전달합니다. |
| `tsconfig.json` | TypeScript 검사·해석 규칙 | 편집기와 빌드가 같은 타입 규칙을 사용하게 합니다. |
| `vite.config.ts` | Vinext·Tailwind·Sites 빌드 설정 | 로컬 앱을 배포 가능한 Cloudflare Worker 결과로 변환합니다. |
