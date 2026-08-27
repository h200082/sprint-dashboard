/**
 * 역할: Next.js·TypeScript 코드에 적용할 정적 분석 규칙과 검사 제외 경로를 설정합니다.
 * 필요한 이유: 실행 전에 흔한 오류와 품질 문제를 찾아 팀 전체가 같은 코드 기준을 유지하도록 합니다.
 */

import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';
import nextTs from 'eslint-config-next/typescript';

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);

export default eslintConfig;
