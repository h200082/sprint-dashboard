/**
 * 역할: 브라우저 입력 요소에 shadcn의 공통 크기, 테두리, 포커스 스타일을 적용합니다.
 * 필요한 이유: 거래 검색 입력창이 다른 컨트롤과 시각적으로 어울리고 키보드 포커스를 분명하게 보여주도록 합니다.
 * 직접 수정: 이 파일을 바꾸면 모든 Input이 변경됩니다. 거래 검색창만 바꾸려면 TransactionsCard의 Input className을 수정하세요.
 */

import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
