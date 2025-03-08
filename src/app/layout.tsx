import './globals.css'
import type { Metadata } from 'next'
import { LanguageProvider } from '@/lib/context/LanguageContext'

export const metadata: Metadata = {
  title: 'Aviniti - Your Ideas, Our Reality',
  description: 'Aviniti is a dynamic and innovative software and app development company based in Amman, Jordan.',
  verification: {
    other: {
      'msvalidate.01': '91B0C67DCCBBDB8F54D6E11EE8F18F25',
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning>
      <body className="antialiased">
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  )
} 