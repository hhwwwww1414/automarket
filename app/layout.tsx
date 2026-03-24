import type { Metadata, Viewport } from 'next'
import { Inter, Manrope } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { PremiumBackground } from '@/components/layout/premium-background'
import './globals.css'

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
});

const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-display',
  weight: ['500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: 'vin2win — Профессиональный авторынок',
  description: 'B2B-платформа для перекупов, подборщиков и менеджеров. Быстрая оценка лотов, публикация и поиск объявлений без B2C-шума.',
  keywords: ['автомобили', 'перекуп', 'автоподборщик', 'авторынок', 'продажа авто', 'купить авто', 'б2б авто'],
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: '#003B46',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className={`${inter.variable} ${manrope.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          <PremiumBackground cursorReactive />
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
