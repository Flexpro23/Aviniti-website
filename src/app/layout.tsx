import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aviniti - Your Ideas, Our Reality',
  description: 'Aviniti is a dynamic and innovative software and app development company based in Amman, Jordan.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
} 