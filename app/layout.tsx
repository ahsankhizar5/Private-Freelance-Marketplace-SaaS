/*
 * FreelanceHub - SaaS Freelancing Marketplace
 * Developed by: Ahsan Khizar
 * GitHub: https://github.com/ahsankhizar5
 * A comprehensive platform connecting businesses with freelancers
 */

import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'

export const metadata: Metadata = {
  title: 'FreelanceHub - SaaS Freelancing Marketplace',
  description: 'Professional freelancing marketplace platform developed by Ahsan Khizar',
  generator: 'Ahsan Khizar',
  creator: 'Ahsan Khizar',
  authors: [{ name: 'Ahsan Khizar', url: 'https://github.com/ahsankhizar5' }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>{children}</body>
    </html>
  )
}
