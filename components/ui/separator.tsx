/**
 * 역할: 콘텐츠 그룹 사이의 경계를 의미와 함께 표현하는 shadcn Separator입니다.
 * 필요한 이유: 화면을 확장하면서 카드 내부 구역을 나눌 때 단순 border 반복 대신 일관된 구분선을 재사용할 수 있습니다.
 * 참고: 현재 화면은 카드·표의 자체 테두리를 사용하므로 이 부품은 확장 학습용입니다.
 */

"use client"

import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"

import { cn } from "@/lib/utils"

function Separator({
  className,
  orientation = "horizontal",
  ...props
}: SeparatorPrimitive.Props) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      orientation={orientation}
      className={cn(
        "shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",
        className
      )}
      {...props}
    />
  )
}

export { Separator }
