/**
 * 역할: 조건부 CSS 클래스와 Tailwind 클래스를 안전하게 합치는 공용 cn() 함수를 제공합니다.
 * 필요한 이유: shadcn 컴포넌트의 기본 스타일을 확장할 때 충돌한 Tailwind 클래스를 올바른 우선순위로 정리합니다.
 */

import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
