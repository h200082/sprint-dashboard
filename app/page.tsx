/**
 * 역할: 루트 경로(/)의 Quantico 대시보드 화면, 예제 데이터, 차트와 사용자 상호작용을 구성합니다.
 * 필요한 이유: 사용자가 실제로 보는 KPI·활동 차트·거래 표를 하나의 페이지 흐름으로 조립하는 진입점입니다.
 */

/*
 * ============================================================================
 * 비전공자를 위한 이 파일 수정 순서
 * ============================================================================
 *
 * 1. 터미널에서 `npm run dev`를 한 번 실행합니다.
 * 2. 브라우저에서 http://localhost:3000 을 엽니다.
 * 3. 이 파일에서 원하는 부분을 수정하고 Ctrl+S로 저장합니다.
 * 4. 개발 서버의 HMR(Hot Module Replacement)이 변경된 부분만 다시 만들어
 *    브라우저에 보통 1~2초 안에 반영합니다. 매번 새로고침할 필요가 없습니다.
 *
 * 처음에는 Ctrl+F로 아래 검색어를 찾아 한 구역씩 수정해 보세요.
 *
 * - `직접 수정 1` : KPI 카드 4개의 글자·숫자·색상
 * - `직접 수정 2` : Product Activity의 항목·숫자·색상
 * - `직접 수정 3` : 상단의 왼쪽/오른쪽 너비와 위치
 * - `직접 수정 4` : KPI 카드의 2×2 배치와 간격
 * - `직접 수정 5` : 대시보드 전체 너비·바깥 여백·둥근 프레임
 * - `직접 수정 6` : 사이드바 너비와 모바일 메뉴 전환 시점
 * - `직접 수정 7` : 본문 전체 여백과 카드 사이 세로 간격
 * - `직접 수정 8` : Product Activity 안의 도넛/범례 배치
 * - `직접 수정 9` : 중단 차트 2개의 비율·순서·반응형 시점
 * - `직접 수정 10`: 거래 표의 최소 너비와 모바일 가로 스크롤
 * - `MetricCard`   : KPI 카드 하나의 내부 디자인
 * - `ProductActivityCard` : 도넛 카드의 내부 디자인
 *
 * ---------------------------------------------------------------------------
 * 코드를 안전하게 수정하는 7가지 규칙
 * ---------------------------------------------------------------------------
 *
 * 1. 글자는 따옴표 안쪽만 바꿉니다.
 *    예: title: "Nominal Balance" → title: "현재 잔액"
 *
 * 2. 쉼표(,), 중괄호({ }), 대괄호([ ])는 데이터의 경계입니다.
 *    처음에는 글자와 숫자만 바꾸고 이 기호는 삭제하지 마세요.
 *
 * 3. 색상은 `#`으로 시작하는 6자리 값입니다.
 *    예: "#e33b91" → "#ff8800"
 *
 * 4. className 안의 단어는 Tailwind CSS 스타일입니다.
 *    `gap-2`는 간격, `p-2.5`는 안쪽 여백, `rounded-lg`는 둥근 모서리입니다.
 *    단어 사이는 반드시 공백으로 구분합니다.
 *
 * 5. `sm:`, `md:`, `min-[740px]:` 앞부분은 화면 너비 조건입니다.
 *    예: `sm:grid-cols-2`는 화면이 640px 이상일 때 2열로 만든다는 뜻입니다.
 *
 * 6. 빨간 오류 화면이 나오면 방금 수정한 줄에서 따옴표·쉼표·괄호를 확인합니다.
 *    해결이 어렵다면 Ctrl+Z로 직전 수정만 되돌리면 됩니다.
 *
 * 7. `components/ui`는 여러 화면이 공유하는 기본 부품입니다.
 *    한 카드만 바꿀 때는 이 파일의 className을 수정하고,
 *    모든 카드의 공통 기본값을 바꿀 때만 components/ui/card.tsx를 수정하세요.
 *
 * 화면에 보이지 않는 이 주석은 삭제하지 않아도 속도나 디자인에 영향을 주지 않습니다.
 * ============================================================================
 */

"use client"

// 이 문장은 이 파일이 클릭·입력처럼 브라우저에서 변하는 값을 사용한다는 표시입니다.
// 삭제하면 아래의 useState, onClick 같은 상호작용 코드를 사용할 수 없으므로 그대로 두세요.

// import는 다른 파일이나 라이브러리에서 필요한 기능을 가져오는 문장입니다.
// 기존 화면의 글자·숫자·색상만 바꿀 때는 아래 import 영역을 수정할 필요가 없습니다.
import { useMemo, useState } from "react"
import type { LucideIcon } from "lucide-react"
import {
  BarChart3, Boxes, Calendar, CircleDollarSign, CreditCard, Home,
  LayoutDashboard, Maximize2, Menu, MessageSquare, MoreHorizontal,
  Package, Receipt, Search, ShoppingCart, Sparkles, Tags,
  TrendingDown, TrendingUp, UserPlus, Users, Wallet,
} from "lucide-react"
import {
  Activity,
  ChevronDown,
  ChevronRight,
  Download,
  EyeOff,
  Globe2,
  SlidersHorizontal,
} from "lucide-react"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"

type NavigationItem = {
  label: string
  icon: LucideIcon
  children?: string[]
}

/*
 * 사이드바 메뉴 데이터입니다.
 * label은 화면에 보이는 메뉴 이름, icon은 왼쪽 아이콘입니다.
 * children이 있는 항목은 아래에 하위 메뉴가 생깁니다.
 * 메뉴 이름만 바꿀 때는 따옴표 안의 글자만 수정하세요.
 */
const navigation: NavigationItem[] = [
  { label: "Home", icon: Home },
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    children: ["Analytics", "Sales Overview", "Top Products", "Stock Status"],
  },
  { label: "Analytics", icon: BarChart3 },
  { label: "Products", icon: Package },
  { label: "Categories", icon: Tags },
  { label: "Orders", icon: ShoppingCart },
  { label: "Taxes", icon: Receipt },
  { label: "Analytics", icon: BarChart3 },
  { label: "Customers", icon: Users },
  { label: "Reviews", icon: MessageSquare },
  { label: "Payments", icon: CreditCard },
]

/*
 * [직접 수정 1: 왼쪽 상단 KPI 4개의 내용]
 *
 * 이 배열의 순서가 화면의 카드 순서가 됩니다.
 * 1번·2번 항목은 첫째 줄, 3번·4번 항목은 둘째 줄에 표시됩니다.
 *
 * - title: 카드 제목을 바꿉니다.
 * - value / unit: 큰 숫자와 단위를 바꿉니다.
 * - change / trend: 증감률과 상승(up)·하락(down) 색상을 바꿉니다.
 * - color / icon: 제목 왼쪽 원형 아이콘의 색상과 아이콘을 바꿉니다.
 * - points: 오른쪽 스파크라인의 굴곡을 바꿉니다. 숫자의 개수는 자유롭게 늘릴 수 있습니다.
 *
 * 카드를 추가하면 자동으로 그리드에 들어가지만, 사진과 같은 2×2 구성을 유지하려면 4개를 유지하세요.
 *
 * 초보자 실습 예시:
 *
 *   title: "Nominal Balance"  ← 따옴표 안쪽을 "현재 잔액"으로 바꿔 보기
 *   value: "7,500.00"         ← 화면에 표시할 숫자 바꾸기
 *   unit: "USD"               ← "원" 또는 "KRW"로 바꾸기
 *   change: "1.19%"           ← 증감률 글자 바꾸기
 *   trend: "up" as const      ← up은 초록 상승, down은 빨강 하락
 *
 * 각 카드 객체는 `{`에서 시작해 `}`에서 끝납니다.
 * 카드와 카드 사이의 쉼표는 삭제하지 마세요.
 * `[ ... ]`는 여러 카드를 순서대로 담는 "배열", `{ ... }`는 카드 하나의 정보를 묶는 "객체"입니다.
 * metrics의 value는 계산하지 않고 그대로 보여주기 때문에 따옴표가 있는 문자열입니다.
 * 반대로 productActivity의 value는 합계를 계산하므로 따옴표가 없는 숫자입니다.
 */
const metrics = [
  {
    id: "balance", title: "Nominal Balance", value: "7,500.00", unit: "USD",
    change: "1.19%", trend: "up" as const, icon: Wallet, color: "#e33b91",
    points: [18, 29, 16, 35, 22, 24, 38, 17, 13, 32, 21, 41],
  },
  {
    id: "stock", title: "Total Stock Product", value: "3,142", unit: "ITEMS",
    change: "0.29%", trend: "up" as const, icon: Boxes, color: "#2fb4df",
    points: [17, 30, 15, 34, 22, 19, 39, 25, 17, 34, 24, 43],
  },
  {
    id: "revenue", title: "Nominal Revenue", value: "21,430.00", unit: "USD",
    change: "0.29%", trend: "up" as const, icon: CircleDollarSign, color: "#3366f5",
    points: [18, 30, 16, 33, 27, 15, 34, 22, 37, 19, 21, 40],
  },
  {
    id: "expense", title: "Nominal Expense", value: "12,980.00", unit: "USD",
    change: "0.15%", trend: "down" as const, icon: BarChart3, color: "#8657ef",
    points: [39, 14, 29, 11, 27, 32, 12, 10, 31, 22, 13, 28],
  },
]

/*
 * [직접 수정 2: 오른쪽 상단 Product Activity의 범례와 도넛]
 * label은 범례 이름, value는 도넛 비율과 오른쪽 숫자, color는 조각 색상입니다.
 * 항목을 추가하거나 삭제해도 도넛 둘레와 범례는 이 배열을 기준으로 자동 계산됩니다.
 *
 * 예: `{ label: "배송 준비", value: 110000, color: "#2fb4df" }`
 * value는 계산에 사용하므로 따옴표 없이 숫자만 입력하세요.
 * 네 value의 합계가 도넛 중앙 Total Activity 값이 됩니다.
 */
const productActivity = [
  { label: "To Be Packed", value: 110000, color: "#2fb4df" },
  { label: "Process Delivery", value: 98000, color: "#f0b51c" },
  { label: "Delivery Done", value: 140000, color: "#24b7a4" },
  { label: "Returned", value: 67236, color: "#e33b91" },
]

const people = [
  { initials: "AK", color: "#25c77b" },
  { initials: "MR", color: "#ef7b45" },
  { initials: "LS", color: "#e33b91" },
  { initials: "JT", color: "#2fb4df" },
]

/*
 * Customers Activity의 월별 막대그래프 데이터입니다.
 * month는 아래 월 이름, paid와 checkout은 막대 높이입니다.
 * active: true가 있는 달만 파랑·하늘색으로 강조됩니다.
 * 데이터와 화면 코드를 분리했기 때문에 한 줄을 복사해 숫자만 바꾸면 월을 추가할 수 있습니다.
 */
const monthlyActivity = [
  { month: "Apr 2025", paid: 820, checkout: 1080 },
  { month: "May 2025", paid: 1450, checkout: 1720 },
  { month: "Jun 2025", paid: 1190, checkout: 1490 },
  { month: "Jul 2025", paid: 890, checkout: 1300, active: true },
  { month: "Aug 2025", paid: 990, checkout: 760 },
  { month: "Sep 2025", paid: 1420, checkout: 1280 },
  { month: "Oct 2025", paid: 1780, checkout: 1540 },
]

/*
 * Customers Active의 국가별 데이터입니다.
 * percent는 0~100 사이 숫자로 입력하며 진행 막대 길이를 결정합니다.
 * colorClass의 마지막 색상 코드만 바꾸면 막대 색상이 바뀝니다.
 */
const activeCustomers = [
  { country: "United Kingdom", flag: "GB", count: "12,628", percent: 80, colorClass: "[&_[data-slot=progress-indicator]]:bg-[#25c77b]" },
  { country: "United States", flag: "US", count: "10,628", percent: 70, colorClass: "[&_[data-slot=progress-indicator]]:bg-[#ee7434]" },
  { country: "Sweden", flag: "SE", count: "8,628", percent: 40, colorClass: "[&_[data-slot=progress-indicator]]:bg-[#3366f5]" },
  { country: "Turkey", flag: "TR", count: "6,628", percent: 30, colorClass: "[&_[data-slot=progress-indicator]]:bg-[#8657ef]" },
  { country: "Spain", flag: "ES", count: "3,628", percent: 20, colorClass: "[&_[data-slot=progress-indicator]]:bg-[#2fb4df]" },
]

/*
 * Recent Transaction 표의 행 데이터입니다.
 * `{ ... }` 한 묶음이 표의 한 행입니다. 기존 행 하나를 통째로 복사한 뒤
 * id가 겹치지 않도록 바꾸면 새 거래를 가장 안전하게 추가할 수 있습니다.
 */
const transactions = [
  {
    id: "AR-47380416-61", product: "Meta Quest 3", detail: "512Gb - White",
    price: "$499.00", customer: "Liam Smith", initials: "LS", customerColor: "#2fb4df",
    date: "02 Apr 2025, 8:15 am", payment: "VISA", account: "4321",
    email: "smith@example.com", productCode: "VR", productColor: "#d8d6d0",
  },
  {
    id: "AR-30631995-17", product: "iPhone 15 Pro Max", detail: "512Gb - eSIM",
    price: "$1,399.00", customer: "Lily Thompson", initials: "LT", customerColor: "#e33b91",
    date: "06 Apr 2025, 6:45 pm", payment: "MC", account: "8890",
    email: "thom@example.com", productCode: "PH", productColor: "#a6a69e",
  },
  {
    id: "AR-79609316-32", product: "MacBook Air M3 (13)", detail: "M3 chip - Ultra-light",
    price: "$1,299.00", customer: "Lucas Young", initials: "LY", customerColor: "#25c77b",
    date: "10 Apr 2025, 11:30 am", payment: "VISA", account: "1023",
    email: "young@example.com", productCode: "MB", productColor: "#82d6d0",
  },
  {
    id: "AR-17288760-13", product: "AirPods Pro", detail: "2nd Gen - USB-C case",
    price: "$229.00", customer: "Isabella Garcia", initials: "IG", customerColor: "#f0b51c",
    date: "14 Apr 2025, 7:50 pm", payment: "VISA", account: "5678",
    email: "garcia@example.com", productCode: "AP", productColor: "#ecebe6",
  },
  {
    id: "AR-24593385-96", product: "Apple Vision Pro", detail: "AR Headset",
    price: "$3,499.00", customer: "Amelia Davis", initials: "AD", customerColor: "#b35adf",
    date: "18 Apr 2025, 9:05 am", payment: "MC", account: "3301",
    email: "davis@example.com", productCode: "HS", productColor: "#8e908f",
  },
  {
    id: "AR-57722590-75", product: "Oura Ring 4", detail: "Health Wearable",
    price: "$399.00", customer: "Caleb Turner", initials: "CT", customerColor: "#ef7b45",
    date: "22 Apr 2025, 10:10 pm", payment: "STRIPE", account: "9823",
    email: "turner@example.com", productCode: "OR", productColor: "#d6cfb8",
  },
]

/**
 * InitialAvatar: 이니셜과 색상만 받아 사용자 아바타를 반복해서 만드는 작은 재사용 컴포넌트입니다.
 * 크기를 바꾸려면 아래 Avatar의 기본 `size-6` 또는 호출 위치의 className을 수정하세요.
 * React에서는 대문자로 시작하는 함수가 화면 조각인 "컴포넌트"가 됩니다.
 * return 안의 JSX가 실제 화면이며 <InitialAvatar /> 형태로 여러 곳에서 재사용합니다.
 */
function InitialAvatar({
  initials,
  color,
  className,
}: {
  initials: string
  color: string
  className?: string
}) {
  return (
    <Avatar className={cn("size-6 border border-[#0b0e0d]", className)}>
      <AvatarFallback
        className="text-[7px] font-semibold text-white"
        style={{ background: "linear-gradient(145deg, " + color + ", #202524)" }}
      >
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}

/**
 * MobileMenu: 화면이 좁아져 데스크톱 사이드바가 사라졌을 때 표시되는 모바일 내비게이션입니다.
 * 메뉴 이름과 순서는 파일 위쪽의 `navigation` 배열에서 수정합니다.
 */
function MobileMenu({ onNavigate }: { onNavigate: () => void }) {
  return (
    <div className="flex h-full flex-col bg-[#080a09]">
      <div className="flex h-12 items-center gap-2.5 border-b border-[#1a1f1d] px-4">
        <div className="grid size-7 place-items-center rounded-lg border border-white/10 bg-[#1a1d1c] text-[#f06ca8]">
          <Sparkles className="size-3.5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-[10px] font-medium text-[#edf0ee]">Quantico</p>
          <p className="text-[7px] text-[#777e7a]">ID: CMP-1006</p>
        </div>
      </div>
      <nav aria-label="Mobile navigation" className="flex-1 overflow-y-auto p-3">
        {navigation.map((item, index) => {
          const Icon = item.icon
          return (
            <div key={item.label + index}>
              <button
                type="button"
                onClick={onNavigate}
                className="flex h-9 w-full items-center gap-2 rounded-md px-2 text-left text-[11px] text-[#9ca39f] hover:bg-[#111514]"
              >
                <Icon className="size-3.5" strokeWidth={1.5} />
                {item.label}
              </button>
              {item.children && (
                <div className="ml-5 border-l border-[#202523] pl-2">
                  {item.children.map((child) => (
                    <button
                      type="button"
                      key={child}
                      onClick={onNavigate}
                      className={cn(
                        "block h-8 w-full rounded-md px-2 text-left text-[10px]",
                        child === "Analytics" ? "bg-[#121615] text-white" : "text-[#737a76]"
                      )}
                    >
                      {child}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </nav>
    </div>
  )
}

/**
 * Sidebar: 사진 왼쪽의 로고, 메뉴, 도움말 카드와 사용자 프로필을 담당합니다.
 *
 * [직접 수정 6: 사이드바 너비와 나타나는 시점]
 *
 * 아래 aside의 배치 클래스만 떼어 읽으면 다음 뜻입니다.
 *
 * - hidden: 우선 모든 화면에서 숨깁니다. Tailwind는 작은 화면 규칙부터 작성합니다.
 * - w-[182px]: 사이드바 너비를 정확히 182px로 만듭니다.
 * - shrink-0: 오른쪽 본문이 넓어져도 사이드바가 찌그러지지 않게 합니다. 처음에는 지우지 마세요.
 * - min-[900px]:flex: 화면이 900px 이상일 때만 다시 보이게 하고 Flex 상자로 만듭니다.
 * - min-[900px]:flex-col: 로고·메뉴·프로필을 위에서 아래 방향으로 쌓습니다.
 *
 * 안전한 실습 1 — 너비만 바꾸기:
 * `w-[182px]` → `w-[220px]`로 바꾸면 메뉴 글자를 위한 공간이 넓어집니다.
 * 다른 코드는 건드리지 않아도 되지만, 본문 영역은 그만큼 좁아집니다.
 *
 * 안전한 실습 2 — 태블릿에서도 사이드바 보이기:
 * `min-[900px]` → `min-[800px]`로 바꿀 수 있습니다.
 * 단, Ctrl+F로 `min-[900px]`를 검색해 모바일 메뉴 버튼·오버레이·바깥 여백도
 * 모두 같은 `min-[800px]`로 바꿔야 두 메뉴가 동시에 보이는 문제를 막을 수 있습니다.
 */
function Sidebar() {
  return (
    <aside className="hidden w-[182px] shrink-0 border-r border-[#1a1f1d] bg-[#080a09] min-[900px]:flex min-[900px]:flex-col">
      <div className="flex h-12 items-center gap-2.5 px-4">
        <div className="grid size-7 place-items-center rounded-lg border border-white/10 bg-[#1a1d1c] text-[#f06ca8]">
          <Sparkles className="size-3.5" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-medium text-[#edf0ee]">Quantico</p>
          <p className="truncate text-[7px] text-[#777e7a]">ID: CMP-1006</p>
        </div>
        <Search className="size-3 text-[#858b88]" aria-hidden="true" />
      </div>

      <nav aria-label="Primary navigation" className="flex-1 overflow-y-auto px-3 pb-3 pt-1">
        {navigation.map((item, index) => {
          const Icon = item.icon
          return (
            <div key={item.label + index} className="mb-0.5">
              <a
                href="#"
                className="flex h-7 items-center gap-2 rounded-md px-2 text-[9px] text-[#8a918d] transition-colors hover:bg-[#111514] hover:text-[#dce0dd]"
              >
                <Icon className="size-3" strokeWidth={1.5} aria-hidden="true" />
                <span>{item.label}</span>
              </a>
              {item.children && (
                <div className="ml-[18px] space-y-0.5 border-l border-[#202523] pl-1.5">
                  {item.children.map((child) => {
                    const active = child === "Analytics"
                    return (
                      <a
                        key={child}
                        href="#"
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "block rounded-md px-2 py-1.5 text-[8px] transition-colors",
                          active
                            ? "bg-[#121615] text-[#eef1ef]"
                            : "text-[#737a76] hover:text-[#c6cbc8]"
                        )}
                      >
                        {child}
                      </a>
                    )
                  })}
                </div>
              )}
            </div>
          )
        })}
      </nav>

      <div className="space-y-3 p-3">
        <Card className="gap-0 rounded-lg border border-[#242927] bg-[#111514] p-2.5 shadow-none ring-0">
          <div className="flex -space-x-1.5">
            {people.slice(0, 3).map((person) => (
              <InitialAvatar key={person.initials} {...person} className="size-5" />
            ))}
          </div>
          <p className="mt-2 text-[9px] font-medium">Need setup help?</p>
          <p className="mt-1 text-[7px] leading-3 text-[#767d79]">
            Get your questions answered in a 1:1 call with our team.
          </p>
          <Button
            variant="outline"
            size="xs"
            className="mt-2 h-5 justify-start border-[#2a302d] bg-[#151918] px-2 text-[7px] text-[#a9afab]"
          >
            <Calendar className="size-2.5" /> Schedule a call
          </Button>
        </Card>
        <div className="flex items-center gap-2 px-1">
          <InitialAvatar initials="NS" color="#f0b51c" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-[8px] font-medium">Nathan Scott</p>
            <p className="truncate text-[7px] text-[#666d69]">scott@example.com</p>
          </div>
          <MoreHorizontal className="size-3 text-[#6d7470]" aria-hidden="true" />
        </div>
      </div>
    </aside>
  )
}

/**
 * DashboardHeader: 상단 경로, 참여자 아바타, Invite 버튼과 모바일 메뉴 버튼을 표시합니다.
 *
 * 배치 클래스를 하나씩 해석하면 다음과 같습니다.
 *
 * - flex: 경로와 Invite 영역을 가로 한 줄에 놓습니다.
 * - h-10: 높이 40px입니다. h-12로 바꾸면 48px이 됩니다.
 * - items-center: 내용물을 헤더 높이의 세로 중앙에 맞춥니다.
 * - justify-between: 첫 묶음은 왼쪽 끝, 두 번째 묶음은 오른쪽 끝으로 보냅니다.
 * - px-3: 좌우 안쪽 여백 12px입니다. px-5로 바꾸면 양옆이 더 여유로워집니다.
 * - shrink-0: 본문이 길어도 헤더 높이가 줄지 않게 합니다. 유지하는 것이 안전합니다.
 *
 * 실습할 때는 먼저 h-10 또는 px-3 중 하나만 바꾸고 저장해 차이를 비교하세요.
 */
function DashboardHeader({ onOpenMenu }: { onOpenMenu: () => void }) {
  return (
    <header className="flex h-10 shrink-0 items-center justify-between border-b border-[#1b201e] px-3">
      <div className="flex min-w-0 items-center gap-2 text-[8px] text-[#68706b]">
        <Button
          variant="ghost"
          size="icon-xs"
          className="-ml-1 text-[#9aa09c] min-[900px]:hidden"
          aria-label="Open menu"
          onClick={onOpenMenu}
        >
          <Menu className="size-3.5" />
        </Button>
        <Home className="size-3" aria-hidden="true" />
        <span>Home</span><span>/</span>
        <LayoutDashboard className="size-3" aria-hidden="true" />
        <span>Dashboard</span><span>/</span>
        <span className="text-[#d8dcda]">Analytics</span>
      </div>
      <div className="flex items-center">
        <div className="mr-2 hidden -space-x-1.5 sm:flex">
          {people.map((person) => (
            <InitialAvatar key={person.initials} {...person} className="size-[22px]" />
          ))}
          <Avatar className="size-[22px] border border-[#0b0e0d]">
            <AvatarFallback className="bg-[#171b19] text-[7px] text-[#8b928e]">+9</AvatarFallback>
          </Avatar>
        </div>
        <Button
          variant="outline"
          size="xs"
          className="h-[22px] border-[#2b302e] bg-[#121514] px-2 text-[8px] text-[#c7ccca]"
        >
          <UserPlus className="size-3" /> Invite
        </Button>
      </div>
    </header>
  )
}

/**
 * Sparkline: KPI 카드의 작은 추세 그래프를 SVG로 그립니다.
 * 그래프 크기는 width/height와 svg의 `w-[74px]`, 선 굵기는 strokeWidth를 수정하세요.
 */
function Sparkline({
  id,
  points,
  color,
}: {
  id: string
  points: number[]
  color: string
}) {
  const width = 92
  const height = 42
  const min = Math.min(...points)
  const max = Math.max(...points)

  // points의 실제 숫자를 SVG 안의 x/y 좌표로 바꾸는 과정입니다.
  // SVG는 왼쪽 위가 (0,0)이고 아래로 갈수록 y가 커지므로, 큰 값이 위에 오도록 height에서 빼 줍니다.
  // 이 계산은 그래프 모양을 자동으로 만들기 때문에 points 값만 바꿀 때는 수정하지 않아도 됩니다.
  const coordinates = points.map((point, index) => {
    const x = (index / (points.length - 1)) * width
    const y = height - 4 - ((point - min) / (max - min || 1)) * (height - 10)
    return [x, y] as const
  })
  const line = coordinates
    .map(([x, y], index) => (index === 0 ? "M" : "L") + x.toFixed(1) + "," + y.toFixed(1))
    .join(" ")
  const area = line + " L" + width + "," + height + " L0," + height + " Z"

  return (
    // viewBox는 SVG 내부 좌표계입니다. CSS 너비가 변해도 선과 그라데이션이 같은 비율로 확대·축소됩니다.
    <svg viewBox={"0 0 " + width + " " + height} className="h-10 w-[74px]" aria-hidden="true">
      <defs>
        <linearGradient id={"fade-" + id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.24" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill={"url(#fade-" + id + ")"} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

/**
 * MetricCard: metrics 배열의 한 항목을 제목·숫자·증감률·스파크라인 카드로 변환합니다.
 * 카드 높이/안쪽 여백은 아래 Card의 `min-h-[100px]`와 `p-2.5`를 바꾸면 됩니다.
 * 네 카드 전체의 배치는 이 컴포넌트가 아니라 HomePage 아래의 "직접 수정 3" 그리드에서 조절합니다.
 *
 * [높이를 바꿀 때 꼭 알아둘 계산]
 * 현재 한 카드 최소 높이 100px × 2줄 + 카드 사이 gap-2(8px) = 총 208px입니다.
 * 따라서 카드 높이를 120px로 키우면 총높이는 `120 × 2 + 8 = 248px`이 됩니다.
 * 이 경우 아래 3곳을 한 세트로 바꿔야 위쪽 카드들의 아랫선이 맞습니다.
 *
 * 1. MetricCard의 `min-h-[100px]` → `min-h-[120px]`
 * 2. ProductActivityCard의 `min-h-[208px]` → `min-h-[248px]`
 * 3. HomePage 상단 Grid의 `grid-rows-[208px]` → `grid-rows-[248px]`
 *
 * 크기 실습은 gap과 비율 실습에 익숙해진 다음 하는 것이 좋습니다.
 */
function MetricCard({ metric }: { metric: (typeof metrics)[number] }) {
  // metric은 부모가 <MetricCard metric={metric} /> 형태로 전달한 입력값(props)입니다.
  // 같은 카드 디자인을 네 번 복사하지 않고, 서로 다른 데이터만 전달하기 위해 props를 사용합니다.
  const Icon = metric.icon
  const positive = metric.trend === "up"
  const TrendIcon = positive ? TrendingUp : TrendingDown
  const trendColor = positive ? "#25c77b" : "#eb3e5c"

  // React에서는 HTML의 class 대신 className을 씁니다.
  // 아래 클래스 예: flex=한 줄 정렬, gap-0=요소 사이 간격 없음, p-2.5=카드 안쪽 여백입니다.
  // bg-[#101312]는 배경색, border-[#202523]는 테두리색, rounded-lg는 둥근 모서리입니다.
  return (
    <Card className="relative h-full min-h-[100px] gap-0 rounded-lg border border-[#202523] bg-[#101312] p-2.5 shadow-none ring-0">
      <div className="flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-1.5">
          <span
            className="grid size-6 shrink-0 place-items-center rounded-full"
            style={{ color: metric.color, backgroundColor: metric.color + "18" }}
          >
            <Icon className="size-3" strokeWidth={1.5} aria-hidden="true" />
          </span>
          <h2 className="truncate text-[9px] font-medium text-[#dfe3e0]">{metric.title}</h2>
        </div>
        <Maximize2 className="size-2.5 text-[#626965]" aria-hidden="true" />
      </div>
      <div className="mt-2 flex items-end gap-1">
        <span className="text-[14px] font-semibold tabular-nums tracking-tight">{metric.value}</span>
        <span className="pb-0.5 text-[7px] text-[#6d746f]">{metric.unit}</span>
      </div>
      <div className="mt-auto flex items-end justify-between">
        <span className="flex items-center gap-1 text-[8px]" style={{ color: trendColor }}>
          <span className="grid size-4 place-items-center rounded-full" style={{ backgroundColor: trendColor + "12" }}>
            <TrendIcon className="size-2.5" aria-hidden="true" />
          </span>
          {metric.change}
        </span>
        <Sparkline id={metric.id} points={metric.points} color={trendColor} />
      </div>
    </Card>
  )
}

/**
 * ProductActivityCard: 기간 버튼, SVG 도넛, 중앙 합계와 범례를 묶은 오른쪽 상단 카드입니다.
 * 도넛 크기는 radius와 `size-[142px]`, 범례 데이터는 파일 위쪽 productActivity 배열에서 수정합니다.
 * 카드의 오른쪽/왼쪽 위치와 너비는 HomePage 아래의 "직접 수정 3" 그리드가 결정합니다.
 */
function ProductActivityCard() {
  // useState(초깃값)는 "현재 값"과 "값을 바꾸는 함수"를 한 쌍으로 만듭니다.
  // 버튼이 setSelectedPeriod("1W")를 호출하면 React가 선택 상태를 바꾸고 화면을 다시 그립니다.
  // selectedPeriod = "1W"처럼 직접 대입하면 화면이 갱신되지 않으므로 set 함수를 사용해야 합니다.
  const [selectedPeriod, setSelectedPeriod] = useState("1M")

  // reduce는 배열의 여러 숫자를 하나로 합칩니다. 여기서는 네 활동 값의 총합을 계산합니다.
  const total = productActivity.reduce((sum, item) => sum + item.value, 0)
  const radius = 54

  // 원 둘레 = 2 × 원주율(PI) × 반지름입니다. 각 value의 비율만큼 이 둘레를 나눠 도넛을 만듭니다.
  const circumference = 2 * Math.PI * radius
  // 렌더링 중 외부 변수를 변경하지 않도록 각 조각의 시작 위치를 데이터로 미리 계산합니다.
  const activitySegments = productActivity.map((item, index) => ({
    ...item,
    segment: (item.value / total) * circumference,
    offset: productActivity
      .slice(0, index)
      .reduce((sum, previous) => sum + (previous.value / total) * circumference, 0),
  }))

  return (
    <Card className="h-full min-h-[208px] gap-0 rounded-lg border border-[#202523] bg-[#101312] p-2.5 shadow-none ring-0">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-1.5">
          <span className="grid size-6 place-items-center rounded-full bg-[#f0b51c18] text-[#f0b51c]">
            <Sparkles className="size-3" aria-hidden="true" />
          </span>
          <h2 className="text-[10px] font-medium">Product Activity</h2>
        </div>
        <div className="flex items-center gap-1" aria-label="Time range">
          {/*
            cn()은 공통 클래스와 조건부 클래스를 하나로 합칩니다.
            현재 선택한 period만 밝은 배경, 나머지는 흐린 글자로 표시됩니다.
          */}
          {["1W", "1M", "3W", "YTD", "Total"].map((period) => (
            <Button
              key={period}
              variant="ghost"
              size="xs"
              onClick={() => setSelectedPeriod(period)}
              aria-pressed={selectedPeriod === period}
              className={cn(
                "h-[18px] rounded-md px-2 text-[7px]",
                selectedPeriod === period ? "bg-[#202329] text-[#edf0ee]" : "text-[#6e7571]"
              )}
            >
              {period}
            </Button>
          ))}
        </div>
      </div>
      {/*
        [직접 수정 8: Product Activity 안의 도넛 / 범례 배치]

        현재 동작:
        - grid: 도넛과 범례를 큰 칸 단위로 배치합니다.
        - 작은 화면: 열 개수를 지정하지 않아 도넛 다음 줄에 범례가 쌓입니다.
        - sm: 화면이 640px 이상일 때 적용되는 조건입니다.
        - sm:grid-cols-[150px_minmax(0,1fr)]: 왼쪽 도넛 칸은 150px,
          오른쪽 범례 칸은 남은 공간 전체를 사용합니다.
        - minmax(0,1fr)의 0은 긴 범례 글자가 카드 너비를 밀어내지 못하게 합니다.
        - gap-3은 두 칸 사이 약 12px, pt-2는 제목 아래 약 8px 여백입니다.

        복사해서 해볼 실습:
        1. 도넛 칸 넓히기: `150px` → `180px`
           이때 바로 아래 `size-[142px]`도 `size-[170px]` 정도로 함께 키워 보세요.
        2. 항상 세로로 쌓기: `sm:grid-cols-[150px_minmax(0,1fr)]`만 삭제합니다.
        3. 작은 화면부터 가로로 놓기: `sm:`을 지워
           `grid-cols-[150px_minmax(0,1fr)]`로 만듭니다. 320px 화면에서는 좁을 수 있습니다.
        4. 도넛을 오른쪽으로 옮기기: 도넛 div에 `sm:order-2`, 범례 div에
           `sm:order-1`을 추가합니다. order는 보이는 순서만 바꾸며 데이터는 바꾸지 않습니다.
      */}
      <div className="grid flex-1 items-center gap-3 pt-2 sm:grid-cols-[150px_minmax(0,1fr)]">
        <div className="relative mx-auto size-[142px]">
          <svg viewBox="0 0 140 140" className="size-full" role="img" aria-label={"Total product activity " + total.toLocaleString()}>
            <circle cx="70" cy="70" r="45" fill="none" stroke="#2b302e" strokeWidth="1" strokeDasharray="1.5 3" />
            <circle cx="70" cy="70" r={radius} fill="none" stroke="#1d2220" strokeWidth="9" />
            {activitySegments.map((item) => (
              <circle
                key={item.label}
                cx="70"
                cy="70"
                r={radius}
                fill="none"
                stroke={item.color}
                strokeWidth="9"
                strokeLinecap="round"
                strokeDasharray={Math.max(item.segment - 7, 0) + " " + circumference}
                strokeDashoffset={-item.offset}
                transform="rotate(-90 70 70)"
              />
            ))}
          </svg>
          <div className="pointer-events-none absolute inset-0 grid place-content-center text-center">
            <strong className="text-[16px] font-semibold tabular-nums tracking-tight">415.236</strong>
            <span className="text-[8px] text-[#6f7672]">Total Activity</span>
          </div>
        </div>
        <div className="min-w-0">
          {productActivity.map((item) => (
            <div key={item.label} className="flex h-7 items-center gap-2 border-b border-[#1b201e] last:border-0">
              <span className="size-2 rounded-sm" style={{ backgroundColor: item.color }} />
              <span className="min-w-0 flex-1 truncate text-[8px] text-[#cbd0cd]">{item.label}</span>
              <span className="text-[8px] tabular-nums text-[#7b827e]">{item.value.toLocaleString()}</span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}

/**
 * CustomersActivityCard: 월별 Paid/Checkout 값을 막대그래프로 비교하는 중단 왼쪽 카드입니다.
 * 월과 수치는 파일 위쪽 monthlyActivity 배열에서 수정합니다.
 *
 * 내부 차트 배치 실습:
 * - `grid-cols-[28px_minmax(0,1fr)]`에서 28px은 왼쪽 Y축 숫자 칸입니다.
 *   숫자가 잘리면 28px을 36px로 바꿉니다. 두 번째 칸은 남는 차트 영역입니다.
 * - 막대의 `w-[42%]`는 각 월 칸에서 막대 하나가 차지하는 비율입니다.
 *   48%로 올리면 굵어지고 32%로 내리면 가늘어집니다.
 * - `max-w-[18px]`은 큰 화면에서 막대가 지나치게 굵어지는 것을 막는 최대값입니다.
 * - 이 카드 높이를 바꿀 때는 ActiveCustomersCard의 `min-h-[210px]`도 같은 값으로 맞추세요.
 */
function CustomersActivityCard() {
  return (
    <Card className="min-h-[210px] gap-0 rounded-lg border border-[#202523] bg-[#101312] p-0 shadow-none ring-0">
      <div className="flex h-10 items-center justify-between gap-3 px-2.5">
        <div className="flex items-center gap-1.5">
          <span className="grid size-6 place-items-center rounded-full bg-[#ee743418] text-[#ee7434]">
            <Activity className="size-3" aria-hidden="true" />
          </span>
          <h2 className="text-[10px] font-medium">Customers Activity</h2>
        </div>
        <div className="flex items-center gap-3 text-[7px] text-[#9aa19d]">
          <span className="flex items-center gap-1">
            <i className="size-1.5 rounded-sm bg-[#3366f5]" /> Paid product
          </span>
          <span className="flex items-center gap-1">
            <i className="size-1.5 rounded-sm bg-[#2fb4df]" /> Checkout Product
          </span>
        </div>
      </div>
      <div className="grid h-[166px] grid-cols-[28px_minmax(0,1fr)] px-2 pb-2">
        <div className="flex flex-col justify-between pb-5 pt-1 text-right text-[7px] text-[#68706b]">
          <span>2000</span><span>1500</span><span>1000</span><span>500</span>
        </div>
        <div className="relative ml-2">
          {[0, 25, 50, 75, 100].map((position) => (
            <span
              key={position}
              className="absolute inset-x-0 border-t border-dashed border-[#242927]"
              style={{ top: String(position) + "%" }}
            />
          ))}
          <div className="absolute inset-0 flex items-end pb-5">
            {monthlyActivity.map((item) => (
              <div key={item.month} className="relative flex h-full min-w-0 flex-1 items-end justify-center gap-1 px-0.5">
                {item.active && (
                  <div className="absolute left-1/2 top-0 z-10 w-[76px] -translate-x-1/2 rounded-md border border-[#2c3230] bg-[#0b0e0d] p-1.5 text-[7px] shadow-xl">
                    <p className="mb-1 text-[#dfe3e0]">Activity</p>
                    <p className="flex justify-between text-[#7e8581]">
                      <span><i className="mr-1 inline-block size-1 bg-[#3366f5]" />Paid</span>
                      <b className="text-[#dfe3e0]">890</b>
                    </p>
                    <p className="flex justify-between text-[#7e8581]">
                      <span><i className="mr-1 inline-block size-1 bg-[#2fb4df]" />Checkout</span>
                      <b className="text-[#dfe3e0]">1300</b>
                    </p>
                  </div>
                )}
                <span
                  className={cn("w-[42%] max-w-[18px] rounded-t-[3px]", item.active ? "bg-[#3366f5]" : "bg-[#24272f]")}
                  style={{ height: String((item.paid / 2000) * 100) + "%" }}
                />
                <span
                  className={cn("w-[42%] max-w-[18px] rounded-t-[3px]", item.active ? "bg-[#2fb4df]" : "bg-[#24272f]")}
                  style={{ height: String((item.checkout / 2000) * 100) + "%" }}
                />
                <span className="absolute inset-x-0 bottom-0 truncate text-center text-[7px] text-[#747b77]">
                  {item.month}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
}

/**
 * ActiveCustomersCard: 국가별 활성 고객 수와 비율을 진행 막대로 보여주는 중단 오른쪽 카드입니다.
 * 국가, 수치, 색상은 파일 위쪽 activeCustomers 배열에서 수정합니다.
 * 이 카드의 바깥 너비와 왼쪽 차트와의 비율은 HomePage의 "직접 수정 9"에서 조절합니다.
 * 카드 자체 높이를 바꾸면 CustomersActivityCard의 `min-h-[210px]`도 같은 값으로 바꿔야 합니다.
 */
function ActiveCustomersCard() {
  return (
    <Card className="min-h-[210px] gap-0 rounded-lg border border-[#202523] bg-[#101312] p-0 shadow-none ring-0">
      <div className="flex h-10 items-center justify-between px-2.5">
        <div className="flex items-center gap-1.5">
          <span className="grid size-6 place-items-center rounded-full bg-[#24b7a418] text-[#24b7a4]">
            <Globe2 className="size-3" aria-hidden="true" />
          </span>
          <h2 className="text-[10px] font-medium">Customers Active</h2>
        </div>
        <Button variant="outline" size="xs" className="h-[18px] border-[#2a302d] bg-[#171a1f] px-2 text-[7px] text-[#8d9490]">
          View All <ChevronRight className="size-2.5" />
        </Button>
      </div>
      <div className="space-y-1 px-2.5 pb-2">
        {activeCustomers.map((item) => (
          <div key={item.country}>
            <div className="mb-1 flex items-center gap-1.5">
              <span className="grid size-4 place-items-center rounded-full bg-[#1d2220] text-[5px] font-bold text-[#dfe3e0]">
                {item.flag}
              </span>
              <span className="min-w-0 flex-1 truncate text-[8px] text-[#d5d9d6]">{item.country}</span>
              <span className="text-[7px] tabular-nums text-[#737a76]">
                {item.count} ({item.percent}%)
              </span>
            </div>
            <Progress
              value={item.percent}
              aria-label={item.country + " active customers " + item.percent + "%"}
              className={cn(
                "w-full gap-0 [&_[data-slot=progress-track]]:h-[3px] [&_[data-slot=progress-track]]:bg-[#20242b]",
                item.colorClass
              )}
            />
          </div>
        ))}
      </div>
    </Card>
  )
}

/**
 * TransactionsCard: 검색, 열 숨기기와 최근 거래 목록을 담당하는 하단 표 컴포넌트입니다.
 * 행 데이터는 파일 위쪽 transactions 배열, 열 제목과 순서는 아래 TableHeader에서 수정합니다.
 *
 * [직접 수정 10: 좁은 화면에서 표가 작동하는 방법]
 * Card의 `overflow-hidden`은 둥근 카드 밖으로 내용이 삐져나오지 않게 합니다.
 * 그 안의 표 감싸개 `overflow-x-auto`가 표 부분에만 가로 스크롤을 만듭니다.
 * Table의 `min-w-[760px]`는 화면이 좁아도 각 열을 읽을 최소 폭을 유지합니다.
 * 760px을 너무 작게 줄이면 이름·날짜·이메일이 겹치므로, 처음에는 680~900px 범위에서만 실습하세요.
 * 검색창의 `w-[140px]`은 기본 너비, `max-w-[40vw]`는 작은 화면에서 화면 폭의 40%를
 * 넘지 못하게 하는 안전장치입니다.
 */
function TransactionsCard() {
  // 아래 세 줄은 사용자가 클릭하거나 입력할 때 바뀌어야 하는 값을 기억합니다.
  // false는 닫힘/표시 안 함, 빈 문자열("")은 검색어가 아직 없다는 뜻입니다.
  const [showSearch, setShowSearch] = useState(false)
  const [query, setQuery] = useState("")
  const [hideOptional, setHideOptional] = useState(false)

  // useMemo는 query가 바뀔 때만 검색 결과를 다시 계산합니다.
  // 처음 공부할 때는 이 검색 로직을 수정하지 않아도 됩니다.
  const filteredTransactions = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return transactions
    return transactions.filter((item) =>
      [item.id, item.product, item.customer, item.email]
        .join(" ")
        .toLowerCase()
        .includes(normalized)
    )
  }, [query])

  return (
    <Card className="gap-0 overflow-hidden rounded-lg border border-[#202523] bg-[#101312] p-0 shadow-none ring-0">
      <div className="flex min-h-10 flex-wrap items-center justify-between gap-2 border-b border-[#1b201e] px-2.5 py-1.5">
        <div className="flex items-center gap-1.5">
          <h2 className="text-[10px] font-medium">Recent Transaction</h2>
          <Badge variant="secondary" className="h-4 rounded px-1 text-[6px] text-[#777e7a]">24</Badge>
        </div>
        <div className="flex min-w-0 flex-1 items-center justify-end gap-1">
          {showSearch && (
            /* showSearch가 true일 때만 검색 입력창을 화면에 만듭니다. 이를 조건부 렌더링이라고 합니다. */
            <div className="relative w-[140px] max-w-[40vw]">
              <Search className="absolute left-2 top-1/2 size-2.5 -translate-y-1/2 text-[#6f7672]" />
              {/* 입력할 때마다 event.target.value에 현재 글자가 들어오고 setQuery가 화면 상태를 갱신합니다. */}
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search"
                aria-label="Search transactions"
                className="h-[22px] rounded-md border-[#2a302d] bg-[#0d100f] pl-6 text-[8px]"
              />
            </div>
          )}
          <Button
            variant="ghost"
            size="xs"
            className="h-[22px] px-1.5 text-[7px] text-[#858c88]"
            onClick={() => setShowSearch((value) => !value)}
            aria-pressed={showSearch}
          >
            <Search className="size-2.5" /> Search
          </Button>
          <Button
            variant="ghost"
            size="xs"
            className="h-[22px] px-1.5 text-[7px] text-[#858c88]"
            onClick={() => setHideOptional((value) => !value)}
            aria-pressed={hideOptional}
          >
            <EyeOff className="size-2.5" /> Hide
          </Button>
          <Button variant="ghost" size="xs" className="h-[22px] px-1.5 text-[7px] text-[#858c88]">
            <SlidersHorizontal className="size-2.5" /> Customize
          </Button>
          <Button variant="outline" size="xs" className="h-[22px] border-[#2a302d] bg-[#171a19] px-2 text-[7px] text-[#929995]">
            <Download className="size-2.5" /> Export <ChevronDown className="size-2.5" />
          </Button>
        </div>
      </div>
      <Table className="min-w-[760px] table-fixed">
        <colgroup>
          <col className="w-[116px]" />
          <col className="w-[142px]" />
          <col className="w-[64px]" />
          <col className="w-[102px]" />
          {!hideOptional && <col className="w-[112px]" />}
          <col className="w-[103px]" />
          {!hideOptional && <col />}
        </colgroup>
        <TableHeader>
          <TableRow className="h-7 border-[#1b201e] hover:bg-transparent">
            <TableHead scope="col" className="h-7 px-2 text-[7px] font-medium uppercase tracking-[0.05em] text-[#69706c]">Order ID</TableHead>
            <TableHead scope="col" className="h-7 px-2 text-[7px] font-medium uppercase tracking-[0.05em] text-[#69706c]">Product Item</TableHead>
            <TableHead scope="col" className="h-7 px-2 text-[7px] font-medium uppercase tracking-[0.05em] text-[#69706c]">Price</TableHead>
            <TableHead scope="col" className="h-7 px-2 text-[7px] font-medium uppercase tracking-[0.05em] text-[#69706c]">Customer</TableHead>
            {!hideOptional && <TableHead scope="col" className="h-7 px-2 text-[7px] font-medium uppercase tracking-[0.05em] text-[#69706c]">Date Checkout</TableHead>}
            <TableHead scope="col" className="h-7 px-2 text-[7px] font-medium uppercase tracking-[0.05em] text-[#69706c]">Payment Method</TableHead>
            {!hideOptional && <TableHead scope="col" className="h-7 px-2 text-[7px] font-medium uppercase tracking-[0.05em] text-[#69706c]">Email</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {/*
            map()은 검색 결과 배열의 각 항목을 같은 모양의 표 행으로 바꿉니다.
            key에는 React가 행을 구분할 수 있도록 중복되지 않는 거래 id를 사용합니다.
          */}
          {filteredTransactions.map((item) => (
            <TableRow key={item.id} className="h-[35px] border-[#1b201e] hover:bg-[#141817]">
              <TableCell className="px-2 py-1 text-[8px] text-[#b9bfbb]">
                <div className="flex items-center gap-1.5">
                  <button type="button" className="grid size-4 place-items-center rounded bg-[#1b1f24] text-[#69706c]" aria-label={"Open " + item.id}>
                    <ChevronRight className="size-2.5" />
                  </button>
                  <span>{item.id}</span>
                </div>
              </TableCell>
              <TableCell className="px-2 py-1">
                <div className="flex items-center gap-1.5">
                  <span
                    className="grid size-[23px] shrink-0 place-items-center rounded text-[6px] font-bold text-[#171918]"
                    style={{ backgroundColor: item.productColor }}
                  >
                    {item.productCode}
                  </span>
                  <span className="min-w-0">
                    <b className="block truncate text-[8px] font-medium text-[#dfe3e0]">{item.product}</b>
                    <small className="block truncate text-[6px] text-[#6e7571]">{item.detail}</small>
                  </span>
                </div>
              </TableCell>
              <TableCell className="px-2 py-1 text-[8px] font-medium tabular-nums text-[#dce0dd]">{item.price}</TableCell>
              <TableCell className="px-2 py-1">
                <div className="flex items-center gap-1.5">
                  <InitialAvatar initials={item.initials} color={item.customerColor} className="size-5" />
                  <span className="truncate text-[8px] text-[#c7ccca]">{item.customer}</span>
                </div>
              </TableCell>
              {!hideOptional && <TableCell className="px-2 py-1 text-[7px] text-[#7d8480]">{item.date}</TableCell>}
              <TableCell className="px-2 py-1">
                <div className="flex items-center gap-1.5">
                  <Badge variant="secondary" className="h-3.5 rounded px-1 text-[5px] text-[#7aa2ff]">{item.payment}</Badge>
                  <span className="text-[7px] text-[#777e7a]">**** {item.account}</span>
                </div>
              </TableCell>
              {!hideOptional && <TableCell className="truncate px-2 py-1 text-[7px] text-[#adb3af]">{item.email}</TableCell>}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {filteredTransactions.length === 0 && (
        <p className="p-6 text-center text-[9px] text-[#717873]">No matching transactions.</p>
      )}
    </Card>
  )
}

/**
 * HomePage: 사이드바·헤더·상단 KPI·차트·거래 표를 최종 화면 순서로 조립하는 페이지 컴포넌트입니다.
 * "어디에 배치할지"는 이 함수에서, "카드 안에 무엇을 표시할지"는 각 컴포넌트와 데이터 배열에서 수정합니다.
 */
export default function HomePage() {
  // 모바일 메뉴가 열렸는지를 true/false로 기억합니다.
  // setMobileOpen(true)는 열기, setMobileOpen(false)는 닫기입니다.
  const [mobileOpen, setMobileOpen] = useState(false)

  /*
   * [직접 수정 5: 대시보드 전체 폭과 바깥 프레임]
   *
   * 아래 main은 브라우저 전체 바탕, 그 안의 첫 번째 div는 실제 대시보드 프레임입니다.
   * 두 상자를 구분해서 생각하면 배치를 훨씬 쉽게 수정할 수 있습니다.
   *
   * main의 핵심 클래스:
   * - min-h-svh: 내용이 짧아도 화면 높이를 최소한 가득 채웁니다.
   * - bg-[#f3f4f3]: 둥근 검정 대시보드 바깥에서 보이는 밝은 배경입니다.
   * - p-0: 모바일에서는 바깥 여백을 없애 공간을 아낍니다.
   * - min-[900px]:p-2: 900px 이상에서 사방 약 8px의 바깥 여백을 만듭니다.
   *
   * 안쪽 프레임 div의 핵심 클래스:
   * - w-full: 사용할 수 있는 너비를 전부 사용합니다.
   * - max-w-[1440px]: 단, 1440px보다 더 넓어지지는 않습니다.
   * - mx-auto: 최대 너비에 도달한 뒤 남는 좌우 공간을 똑같이 나눠 중앙에 둡니다.
   * - flex: Sidebar와 오른쪽 본문을 가로로 나란히 놓습니다.
   * - overflow-hidden: 둥근 프레임 밖으로 자식 배경이나 표가 튀어나오지 않게 합니다.
   *
   * 추천 실습:
   * 1. 조밀한 화면: `max-w-[1440px]` → `max-w-[1200px]`
   * 2. 모니터 폭 전체 사용: `max-w-[1440px]` → `max-w-none`
   * 3. 바깥 여백 늘리기: main의 `min-[900px]:p-2` → `min-[900px]:p-6`
   * 4. 모서리 더 둥글게: `rounded-[18px]` → `rounded-[28px]`
   *
   * 한 번에 하나만 바꿔 저장하고 브라우저 폭도 같이 조절해 보세요.
   */
  return (
    <main className="min-h-svh bg-[#f3f4f3] p-0 text-[#eef1ef] min-[900px]:p-2">
      {/* && 왼쪽 값이 true일 때만 오른쪽 화면을 보여 줍니다. false이면 모바일 메뉴가 만들어지지 않습니다. */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 min-[900px]:hidden" role="dialog" aria-modal="true" aria-label="Navigation">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="relative h-full w-[260px] border-r border-[#202523] shadow-2xl">
            <MobileMenu onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="mx-auto flex min-h-svh w-full max-w-[1440px] overflow-hidden border-[#202523] bg-[#0c0f0e] min-[900px]:min-h-[calc(100svh-16px)] min-[900px]:rounded-[18px] min-[900px]:border">
        <Sidebar />
        {/*
          min-w-0은 오른쪽 본문이 차트나 표의 최소 너비 때문에 프레임 밖으로 밀려나는 것을 막습니다.
          flex-1은 Sidebar가 차지한 공간을 뺀 나머지 너비를 본문이 모두 사용한다는 뜻입니다.
          둘 다 '넘침 방지 + 남은 공간 사용' 역할이므로 초반 배치 실습에서는 유지하세요.
        */}
        <section className="flex min-w-0 flex-1 flex-col">
          <DashboardHeader onOpenMenu={() => setMobileOpen(true)} />
          {/*
            [직접 수정 7: 본문 전체 여백]

            flex-1은 헤더 아래 남는 세로 공간을 본문이 채우게 합니다.
            p-2.5는 모든 카드와 본문 가장자리 사이에 약 10px 여백을 만듭니다.
            더 시원한 화면은 p-4, 더 촘촘한 화면은 p-1.5로 바꿔 비교할 수 있습니다.
            여기의 p 값은 '본문 바깥 여백'이고, 각 Card의 p 값은 '카드 안쪽 여백'이라 서로 다릅니다.
          */}
          <div className="flex-1 p-2.5">
            {/*
              [직접 수정 3: 사진과 같은 상단 전체 배치]

              이 바깥 Grid는 상단을 "왼쪽 KPI 묶음 / 오른쪽 Product Activity" 두 칸으로 나눕니다.

              화면이 740px 이상일 때 보이는 구조:

                ┌─────────────────────┬─────────────────────┐
                │ KPI 카드 2 × 2      │ Product Activity    │
                └─────────────────────┴─────────────────────┘

              화면이 740px보다 작을 때는 `min-[740px]:...` 조건이 적용되지 않아 다음처럼 쌓입니다.

                ┌─────────────────────┐
                │ KPI 카드 묶음       │
                ├─────────────────────┤
                │ Product Activity    │
                └─────────────────────┘

              클래스 해석:
              - grid: 자식을 행과 열로 놓는 큰 배치 도구입니다.
              - items-stretch: 같은 행의 두 자식을 행 높이만큼 늘려 아랫선을 맞춥니다.
              - gap-2: 두 영역 사이 간격 약 8px입니다. gap-3은 약 12px, gap-4는 약 16px입니다.
              - min-[740px]: 740px 이상에서만 뒤의 규칙을 적용하는 사용자 지정 화면 기준입니다.
              - grid-cols-[A_B]: A 너비의 첫 열과 B 너비의 둘째 열을 만듭니다.
                대괄호 안에서 밑줄(_)은 CSS의 공백 역할을 합니다.
              - fr은 '남은 공간의 몫'입니다. 1fr + 1fr은 1:1, 1.2fr + 1fr은 1.2:1입니다.
              - minmax(0,1fr)는 최소 0부터 최대 1몫까지 허용하여 긴 내용의 넘침을 막습니다.
                처음에는 minmax를 지우지 말고 안의 fr 숫자만 바꾸세요.
              - grid-rows-[208px]는 데스크톱 상단 높이를 208px로 고정합니다.

              복사해서 해볼 실습:
              1. Product Activity를 조금 넓게:
                 `min-[740px]:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]`
              2. KPI 영역을 더 넓게:
                 `min-[740px]:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]`
              3. 항상 위아래로 쌓기:
                 `min-[740px]:grid-cols-[...]`와 `min-[740px]:grid-rows-[208px]`를 삭제합니다.
              4. Product Activity를 왼쪽으로 옮기기:
                 아래 JSX 두 줄의 순서를 바꿔 `<ProductActivityCard />`를 KPI div보다 먼저 둡니다.
              5. 나란히 놓이는 시점을 늦추기:
                 두 `min-[740px]`를 `min-[1000px]`로 같이 바꿉니다.

              비율을 바꿀 때는 높이를 건드릴 필요가 없습니다. 높이 실습은 MetricCard 주석의
              `100px × 2 + 8px = 208px` 계산을 먼저 읽고 세 군데를 함께 수정하세요.
            */}
            <section
              aria-label="Key metrics and product activity"
              className="grid items-stretch gap-2 min-[740px]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] min-[740px]:grid-rows-[208px]"
            >
              {/*
                [직접 수정 4: 왼쪽 KPI 4개의 2×2 동일 비율]

                현재 작은 화면에서는 1열이고, 640px 이상(sm)부터 2열 × 2줄입니다.

                  metrics 배열 순서       실제 위치
                  1번 Balance       →      왼쪽 위
                  2번 Stock         →      오른쪽 위
                  3번 Revenue       →      왼쪽 아래
                  4번 Expense       →      오른쪽 아래

                클래스 해석:
                - grid-cols-1: 기본은 가로 1칸이라 카드가 세로로 쌓입니다.
                - sm:grid-cols-2: 640px 이상에서는 가로 2칸입니다.
                - sm:grid-rows-2: 640px 이상에서는 세로 2칸입니다.
                - gap-2: 가로와 세로 카드 사이를 모두 약 8px 띄웁니다.
                - gap-x-4 gap-y-2처럼 쓰면 가로 간격과 세로 간격을 서로 다르게 만들 수 있습니다.

                추천 실습:
                1. 카드 간격만 비교: `gap-2` → `gap-4` → 다시 `gap-2`
                2. 가로/세로 간격 분리: `gap-2` → `gap-x-4 gap-y-2`
                3. 모바일에서도 2열: 앞의 `grid-cols-1`을 `grid-cols-2`로 바꾸고
                   `sm:grid-cols-2`는 삭제합니다. 단, 320px 화면에서는 글자가 좁아질 수 있습니다.
                4. 항상 1열: `sm:grid-cols-2 sm:grid-rows-2`를 삭제합니다.
                   이 경우 전체 높이가 208px보다 커지므로 바깥 고정 높이도 함께 제거해야 합니다.
                5. 네 카드를 한 줄로 보기(고급): 바깥 상단을 먼저 세로 배치로 만든 다음
                   이 div를 `grid grid-cols-1 gap-2 sm:grid-cols-2 min-[1000px]:grid-cols-4`로 바꿉니다.

                metrics.map()은 배열의 4개 데이터를 같은 MetricCard 모양으로 반복 생성합니다.
                카드 순서를 바꾸려면 JSX를 복사하지 말고 파일 위쪽 metrics 배열의 객체 순서를 옮기세요.
                key={metric.id}는 React가 카드를 구분하는 이름이므로 id는 서로 달라야 합니다.
              */}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:grid-rows-2">
                {metrics.map((metric) => (
                  <MetricCard key={metric.id} metric={metric} />
                ))}
              </div>

              {/* 이 컴포넌트를 KPI div보다 먼저 두면 Product Activity가 왼쪽으로 이동합니다. */}
              <ProductActivityCard />
            </section>
            {/*
              [직접 수정 9: 중단 Customers Activity / Customers Active 배치]

              기본 화면에서는 두 컴포넌트가 코드 순서대로 위아래로 쌓입니다.
              md:는 화면이 768px 이상일 때 적용되어 그때부터 두 카드를 나란히 놓습니다.

              - mt-2: 상단 카드 묶음과 중단 카드 사이의 바깥 간격 약 8px입니다.
              - min-w-0: 차트나 긴 국가명이 전체 프레임을 밀어내지 않게 합니다. 유지하세요.
              - gap-2: 두 카드 사이 간격입니다.
              - 1.43fr : 1fr는 약 59% : 41% 비율입니다.
              - 오른쪽 `minmax(270px,1fr)`의 270px은 국가명과 숫자가 겹치지 않을 최소 폭입니다.

              복사해서 해볼 실습:
              1. 정확히 반반: `md:grid-cols-[minmax(0,1fr)_minmax(270px,1fr)]`
              2. 왼쪽을 약 2/3: `md:grid-cols-[minmax(0,2fr)_minmax(270px,1fr)]`
              3. 더 작은 화면부터 나란히: `md:` → `sm:` (640px부터 적용)
              4. 더 큰 화면에서만 나란히: `md:` → `lg:` (1024px부터 적용)
              5. 오른쪽 카드를 왼쪽으로: 아래 컴포넌트 두 줄의 순서를 바꿉니다.
              6. 항상 세로로 보기: `md:grid-cols-[...]` 부분만 삭제합니다.

              처음에는 오른쪽 최소 폭 270px을 유지한 채 fr 비율만 바꾸는 것이 안전합니다.
            */}
            <div className="mt-2 grid min-w-0 gap-2 md:grid-cols-[minmax(0,1.43fr)_minmax(270px,1fr)]">
              <CustomersActivityCard />
              <ActiveCustomersCard />
            </div>
            {/*
              거래 표는 별도의 열 비율 없이 한 줄 전체를 차지합니다.
              mt-2는 중단 카드와 표 사이의 간격입니다. mt-4로 바꾸면 약 16px로 넓어집니다.
              표의 모바일 가로 스크롤과 열 너비는 TransactionsCard의 "직접 수정 10" 주석에서 수정합니다.
            */}
            <div className="mt-2">
              <TransactionsCard />
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
