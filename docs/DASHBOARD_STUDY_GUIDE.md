<!--
역할: 대시보드의 구조와 코드 선택 이유를 순서대로 설명하는 학습 문서입니다.
필요한 이유: 완성 코드를 복사하는 데서 끝나지 않고 shadcn, 레이아웃, SVG 차트와 상태 관리 원리를 복습하게 합니다.
-->

# Quantico 대시보드 학습 가이드

이 문서는 완성된 화면을 따라가며 shadcn/ui, React, Tailwind CSS의 역할을 이해하기 위한 설명서입니다.

## 1. 완성 화면의 구조

화면은 다음 세 층으로 나뉩니다.

1. 앱 셸: 왼쪽 사이드바와 오른쪽 메인 영역
2. 메인 헤더: 이동 경로, 참여자 아바타, Invite 버튼
3. 콘텐츠: KPI 카드, 상품 활동, 고객 활동, 국가별 고객, 거래 표

큰 화면에서 본문은 아래 순서로 배치됩니다.

    Dashboard shell
    ├─ Sidebar (182px)
    └─ Main
       ├─ Header (40px)
       └─ Content
          ├─ KPI 2x2 + Product Activity
          ├─ Customers Activity + Customers Active
          └─ Recent Transaction

이 구조를 먼저 잡은 이유는 화면의 큰 비율이 정확해야 작은 글자와 아이콘을 조정해도 전체가 흔들리지 않기 때문입니다.

## 2. shadcn/ui가 담당하는 부분

shadcn/ui는 완성된 대시보드 템플릿이 아니라 복사해서 소유하는 UI 부품 모음입니다. 이 프로젝트에서는 다음 부품을 실제로 사용했습니다.

| 화면 요소 | shadcn/ui 부품 | 사용 이유 |
| --- | --- | --- |
| 모든 패널 | Card | 배경, 모서리, 테두리 규칙을 통일 |
| 기간/검색/내보내기 | Button | 포커스와 비활성 상태를 일관되게 처리 |
| 사용자 표시 | Avatar, AvatarFallback | 이미지가 없어도 이니셜을 안전하게 표시 |
| 거래 개수 | Badge | 작은 상태값의 크기와 정렬을 통일 |
| 검색창 | Input | 키보드 포커스와 입력 스타일 제공 |
| 국가별 비율 | Progress | 진행률의 의미와 현재 값을 연결 |
| 거래 목록 | Table | 올바른 table, thead, tbody, th, td 구조 제공 |

components/ui 폴더는 shadcn이 만든 공용 원시 부품이고, app/page.tsx는 이 부품을 업무 화면으로 조립하는 곳입니다. 공용 부품을 화면마다 직접 고치지 않고 className으로 조정하면 다른 화면에서도 재사용하기 쉽습니다.

## 3. 직접 만든 부분

다음은 shadcn이 제공하지 않아 직접 작성한 대시보드 전용 컴포넌트입니다.

- MetricCard: KPI의 공통 틀
- Sparkline: 숫자 배열을 SVG 경로로 변환
- ProductActivityCard: 원형 세그먼트와 범례
- CustomersActivityCard: 월별 막대그래프
- ActiveCustomersCard: 국가별 진행률
- TransactionsCard: 검색과 열 숨기기가 가능한 표
- Sidebar, MobileMenu, DashboardHeader: 앱 셸

컴포넌트를 나눈 기준은 “독립적으로 이름을 붙일 수 있고, 자체 데이터나 반복 규칙을 가진 영역인가?”입니다. 아주 작은 아이콘까지 컴포넌트로 분리하면 오히려 파일 이동이 많아져 학습이 어려워집니다.

## 4. Grid와 Flex를 구분하는 법

Grid는 큰 영역의 행과 열을 정할 때 사용합니다.

    <div className="grid gap-2 sm:grid-cols-2 min-[740px]:grid-cols-4">
      ...
    </div>

위 코드는 작은 화면에서는 1열, sm부터 2열, 740px부터 4열로 바뀝니다. Product Activity 카드에 두 칸을 차지하도록 col-span-2를 주어 원본의 4등분 구조를 만들었습니다.

Flex는 한 줄 내부의 정렬에 사용합니다.

    <div className="flex items-center justify-between">
      <h2>Product Activity</h2>
      <PeriodButtons />
    </div>

자주 나온 Tailwind 클래스의 의미는 다음과 같습니다.

- min-w-0: Grid/Flex 자식이 부모보다 넓어져 레이아웃을 밀어내지 않도록 허용
- shrink-0: 사이드바나 아이콘이 압축되지 않도록 고정
- overflow-x-auto: 모바일에서 표만 가로 스크롤
- gap-2: 자식 사이 간격을 부모가 관리
- tabular-nums: 숫자의 각 자릿수 폭을 같게 만들어 열을 정렬

## 5. 데이터 기반 렌더링

KPI 카드 네 개를 JSX로 네 번 복사하지 않고 metrics 배열로 관리합니다.

    {metrics.map((metric) => (
      <MetricCard key={metric.id} metric={metric} />
    ))}

이 프로젝트의 첫 화면에서는 원본 배치 순서를 정확히 맞추기 위해 배열 인덱스로 특정 카드를 배치했지만, 반복되는 거래 행과 국가 행은 map으로 생성합니다.

key에는 배열 순번보다 업무 데이터의 고유값을 사용합니다.

- KPI: metric.id
- 국가: country
- 거래: order id

이렇게 하면 정렬이나 검색으로 배열 순서가 바뀌어도 React가 같은 항목을 계속 추적할 수 있습니다.

## 6. 스파크라인 SVG 계산

Sparkline은 points의 최솟값과 최댓값을 구한 뒤 각 값을 92x42 좌표계 안으로 바꿉니다.

    x = index / (length - 1) * width
    y = height - padding - normalizedValue * plotHeight

SVG는 왼쪽 위가 0,0이고 아래로 내려갈수록 y가 커집니다. 따라서 값이 클수록 위에 보이게 하려면 마지막에 높이에서 계산값을 빼야 합니다.

viewBox를 사용한 이유는 실제 카드 너비가 달라져도 브라우저가 내부 좌표를 비례 확대/축소하기 때문입니다. path의 d 속성에는 M으로 첫 점을 이동하고 L로 다음 점을 연결한 문자열을 넣습니다.

영역 채우기는 선 경로 뒤에 카드 바닥 좌표를 추가해 닫힌 도형을 만든 다음 linearGradient를 적용했습니다. 숫자 자체가 이미 카드에 있으므로 스파크라인은 aria-hidden으로 장식 요소 처리했습니다.

## 7. 도넛 차트 계산

Product Activity는 SVG circle의 둘레를 구해 각 항목이 차지할 길이로 바꿉니다.

    circumference = 2 * PI * radius
    segmentLength = value / total * circumference

- strokeDasharray: 현재 항목이 칠해질 길이
- strokeDashoffset: 앞 항목 뒤에서 시작하도록 누적한 위치
- rotate(-90): 원의 시작점을 3시 방향에서 12시 방향으로 이동
- strokeLinecap="round": 세그먼트 양 끝을 둥글게 처리

차트와 오른쪽 범례가 같은 productActivity 배열을 사용하기 때문에 색상과 수치가 어긋날 가능성이 줄어듭니다.

## 8. 막대그래프 계산

월별 값은 최대값 2000을 기준으로 백분율 높이로 변환합니다.

    height = value / 2000 * 100 + "%"

선택되지 않은 달은 모두 어두운 회색으로 낮추고, Jul 2025만 파랑과 청록으로 강조했습니다. 색을 많이 쓰기보다 중요한 한 지점에만 색을 집중하는 것이 원본 화면의 시각적 위계를 만듭니다.

## 9. 상태와 상호작용

이 화면에서 React 상태가 필요한 부분만 useState를 사용했습니다.

- selectedPeriod: 상품 활동 기간 버튼의 선택 상태
- mobileOpen: 900px 미만에서 모바일 메뉴 열림/닫힘
- showSearch: 거래 검색 입력창 표시
- query: 거래 검색어
- hideOptional: 날짜와 이메일 열 숨김

검색 결과는 useMemo로 계산합니다. query가 바뀔 때만 거래 배열을 다시 필터링하므로, 렌더링 때마다 불필요하게 같은 계산을 반복하지 않습니다. 현재 데이터는 작아 성능 차이가 크지 않지만 데이터 흐름을 명확하게 보여 주는 학습 예제입니다.

상태가 필요 없는 Invite, Customize, Export는 실제 서버 기능이 없는 학습 화면이므로 시각적 버튼으로만 남겼습니다. 백엔드 요구가 생긴 다음에 동작을 추가하는 것이 불필요한 상태를 만들지 않는 방법입니다.

## 10. 반응형 설계

기준 이미지는 약 982px 폭에서도 182px 사이드바가 보입니다. Tailwind 기본 lg 기준은 1024px이므로 이 화면은 min-[900px]이라는 임의 중단점을 사용했습니다.

- 900px 이상: 고정 사이드바, 원본과 같은 앱 프레임
- 740px 이상: KPI 4열, Product Activity 2열 점유
- 640px 이상: KPI 2열, 도넛과 범례를 나란히 배치
- 768px 이상: 고객 활동과 국가별 고객을 두 열로 배치
- 작은 화면: 모바일 메뉴 오버레이, 모든 카드를 세로 적층
- 거래 표: 글자를 지나치게 줄이지 않고 가로 스크롤 허용

반응형은 단순히 전체를 축소하는 작업이 아닙니다. 정보의 읽을 수 있는 최소 크기를 유지한 채 배치 방식만 바꾸는 작업입니다.

## 11. 접근성에서 확인할 것

- 현재 Analytics 메뉴에 aria-current="page" 사용
- nav에 Primary navigation이라는 이름 제공
- 아이콘 전용 버튼에 aria-label 제공
- 기간 버튼에 aria-pressed 제공
- 검색 Input에 접근 가능한 이름 제공
- Progress에 국가명과 현재 퍼센트를 함께 제공
- TableHead에 scope="col" 사용
- 색상만으로 상승/하락을 표현하지 않고 아이콘과 수치를 함께 표시
- 모바일 메뉴에 role="dialog"와 aria-modal 제공
- 포커스 링은 shadcn 기본값을 유지

## 12. 왜 이렇게 작은 글자와 간격을 사용했나

참고 화면은 일반적인 마케팅 사이트가 아니라 많은 정보를 한 번에 비교하는 운영 대시보드입니다. 그래서 8px 간격, 7~10px 보조 글자, 1px 테두리를 사용했습니다.

다만 실제 제품에서는 사용자의 시력, 화면 밀도, 접근성 기준에 따라 기본 글자를 더 크게 잡는 것이 좋습니다. 이번 값은 참고 이미지를 재현하기 위한 학습용 선택입니다.

색상도 배경 전체에 사용하지 않고 상태와 차트에만 제한했습니다. 거의 검은 표면의 미세한 명도 차이와 얇은 테두리가 카드 경계를 만들고, 초록/파랑/분홍/노랑은 의미가 있는 값에만 시선을 모읍니다.

## 13. 직접 해볼 연습

1. metrics 배열에 KPI 하나를 추가하고 5개일 때 Grid가 어떻게 보이는지 확인합니다.
2. Product Activity의 기간별 데이터 객체를 만들고 selectedPeriod에 따라 도넛 값을 변경합니다.
3. Customers Activity에서 다른 달을 클릭하면 active 상태가 이동하도록 만듭니다.
4. 거래 표에 가격 범위 필터를 추가합니다.
5. 라이트 테마 토큰을 만들고 테마 전환 버튼을 연결합니다.
6. mock 데이터 대신 API 응답을 받아 loading, error, empty 상태를 설계합니다.

## 14. 파일 안내

- app/page.tsx: 데이터, 대시보드 컴포넌트, 상호작용, 전체 조립
- app/globals.css: shadcn 색상 토큰과 전역 스타일
- components/ui: shadcn CLI가 생성한 공용 UI 원시 부품
- app/layout.tsx: 문서 언어와 페이지 메타데이터
- public/og.png: 공유 링크용 미리보기 이미지

코드를 읽을 때는 HomePage의 조립 구조를 먼저 보고, 그다음 각 카드 컴포넌트, 마지막으로 데이터 배열과 SVG 계산 순서로 내려가는 것이 가장 이해하기 쉽습니다.
