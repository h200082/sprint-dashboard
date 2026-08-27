/**
 * 역할: 루트 경로(/)의 Quantico 대시보드 화면, 예제 데이터, 차트와 사용자 상호작용을 구성합니다.
 * 필요한 이유: 사용자가 실제로 보는 KPI·활동 차트·거래 표를 하나의 페이지 흐름으로 조립하는 진입점입니다.
 */

"use client"

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

// Data stays separate from markup so adding a row never requires copying JSX.
const monthlyActivity = [
  { month: "Apr 2025", paid: 820, checkout: 1080 },
  { month: "May 2025", paid: 1450, checkout: 1720 },
  { month: "Jun 2025", paid: 1190, checkout: 1490 },
  { month: "Jul 2025", paid: 890, checkout: 1300, active: true },
  { month: "Aug 2025", paid: 990, checkout: 760 },
  { month: "Sep 2025", paid: 1420, checkout: 1280 },
  { month: "Oct 2025", paid: 1780, checkout: 1540 },
]

const activeCustomers = [
  { country: "United Kingdom", flag: "GB", count: "12,628", percent: 80, colorClass: "[&_[data-slot=progress-indicator]]:bg-[#25c77b]" },
  { country: "United States", flag: "US", count: "10,628", percent: 70, colorClass: "[&_[data-slot=progress-indicator]]:bg-[#ee7434]" },
  { country: "Sweden", flag: "SE", count: "8,628", percent: 40, colorClass: "[&_[data-slot=progress-indicator]]:bg-[#3366f5]" },
  { country: "Turkey", flag: "TR", count: "6,628", percent: 30, colorClass: "[&_[data-slot=progress-indicator]]:bg-[#8657ef]" },
  { country: "Spain", flag: "ES", count: "3,628", percent: 20, colorClass: "[&_[data-slot=progress-indicator]]:bg-[#2fb4df]" },
]

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
 * 너비는 첫 번째 aside의 `w-[182px]`, 표시 기준은 `min-[900px]`에서 수정할 수 있습니다.
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
 * 헤더 높이는 header 요소의 `h-10`, 좌우 여백은 `px-3` 값을 바꾸면 됩니다.
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

  // Normalize data into a stable SVG viewBox so the chart scales with its card.
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
 */
function MetricCard({ metric }: { metric: (typeof metrics)[number] }) {
  const Icon = metric.icon
  const positive = metric.trend === "up"
  const TrendIcon = positive ? TrendingUp : TrendingDown
  const trendColor = positive ? "#25c77b" : "#eb3e5c"

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
  const [selectedPeriod, setSelectedPeriod] = useState("1M")
  const total = productActivity.reduce((sum, item) => sum + item.value, 0)
  const radius = 54
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
 */
function TransactionsCard() {
  const [showSearch, setShowSearch] = useState(false)
  const [query, setQuery] = useState("")
  const [hideOptional, setHideOptional] = useState(false)

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
            <div className="relative w-[140px] max-w-[40vw]">
              <Search className="absolute left-2 top-1/2 size-2.5 -translate-y-1/2 text-[#6f7672]" />
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
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <main className="min-h-svh bg-[#f3f4f3] p-0 text-[#eef1ef] min-[900px]:p-2">
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
        <section className="flex min-w-0 flex-1 flex-col">
          <DashboardHeader onOpenMenu={() => setMobileOpen(true)} />
          <div className="flex-1 p-2.5">
            {/*
              [직접 수정 3: 사진과 같은 상단 전체 배치]

              이 바깥 Grid는 상단을 "왼쪽 KPI 영역 / 오른쪽 Product Activity" 두 칸으로 나눕니다.
              - min-[740px] 이상에서 2열이 되므로 Product Activity가 오른쪽으로 이동합니다.
              - 두 개의 minmax(0,1fr)가 1:1 비율이라 좌우 너비가 같습니다.
              - grid-rows-[208px]는 100px KPI 두 줄 + 8px 간격과 같은 전체 높이를 고정합니다.
              - Product Activity를 더 넓게 만들려면 두 번째 값을 1.2fr처럼 바꾸세요.
                예: min-[740px]:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]
              - gap-2를 gap-3으로 바꾸면 왼쪽과 오른쪽 카드 사이가 더 벌어집니다.
            */}
            <section
              aria-label="Key metrics and product activity"
              className="grid items-stretch gap-2 min-[740px]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] min-[740px]:grid-rows-[208px]"
            >
              {/*
                [직접 수정 4: 왼쪽 KPI 4개의 2×2 동일 비율]

                sm:grid-cols-2 = 가로 2칸, sm:grid-rows-2 = 세로 2칸입니다.
                metrics.map()이 배열의 4개 항목을 같은 MetricCard로 만들기 때문에 모두 같은 비율이 됩니다.
                순서를 바꾸려면 파일 위쪽 metrics 배열의 항목 순서를 옮기세요.
                카드 사이 간격은 gap-2, 카드 높이는 MetricCard의 min-h-[100px]에서 수정합니다.
              */}
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:grid-rows-2">
                {metrics.map((metric) => (
                  <MetricCard key={metric.id} metric={metric} />
                ))}
              </div>

              {/* 이 컴포넌트를 KPI div보다 먼저 두면 Product Activity가 왼쪽으로 이동합니다. */}
              <ProductActivityCard />
            </section>
            {/* minmax(0, 1fr) prevents charts from forcing their grid column wider. */}
            <div className="mt-2 grid min-w-0 gap-2 md:grid-cols-[minmax(0,1.43fr)_minmax(270px,1fr)]">
              <CustomersActivityCard />
              <ActiveCustomersCard />
            </div>
            <div className="mt-2">
              <TransactionsCard />
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
