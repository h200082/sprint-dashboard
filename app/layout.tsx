/**
 * 역할: 모든 페이지를 감싸는 루트 레이아웃으로 폰트, 전역 CSS, 문서 언어와 공유 메타데이터를 설정합니다.
 * 필요한 이유: 페이지마다 반복할 공통 설정을 한곳에서 적용하고 검색·SNS 미리보기에 올바른 정보를 제공합니다.
 */

import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// 배포 주소를 기준점으로 두면 /og.png 같은 상대 경로도 절대 URL로 해석됩니다.
const siteUrl = new URL('https://quantico-analytics-dashboard.h200082.chatgpt.site');

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: 'Quantico Analytics Dashboard',
  description: 'A responsive shadcn analytics dashboard study project.',
  openGraph: {
    title: 'Quantico Analytics Dashboard',
    description: 'A responsive shadcn analytics dashboard study project.',
    url: siteUrl,
    siteName: 'Quantico Analytics Dashboard',
    images: [
      {
        url: new URL('/og.png', siteUrl).toString(),
        width: 1200,
        height: 630,
        alt: 'Quantico Analytics shadcn dashboard study project',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Quantico Analytics Dashboard',
    description: 'A responsive shadcn analytics dashboard study project.',
    images: [new URL('/og.png', siteUrl).toString()],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
