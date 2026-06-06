import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PCG, Resurrection Congregation — Atlanta',
  description: 'Church management platform for PCG, Resurrection Congregation, Atlanta, GA',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
