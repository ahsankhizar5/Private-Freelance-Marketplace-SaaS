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
  title: {
    default: 'FreelanceHub - Premium SaaS Freelancing Marketplace',
    template: '%s | FreelanceHub - By Ahsan Khizar'
  },
  description: 'Professional SaaS freelancing marketplace platform built with Next.js 14, Supabase, and TypeScript. Connect businesses with top freelancers in a secure, feature-rich environment. Developed by Ahsan Khizar.',
  keywords: [
    'freelance marketplace',
    'SaaS platform', 
    'Next.js 14',
    'Supabase',
    'TypeScript',
    'React 19',
    'freelancer platform',
    'job marketplace',
    'Ahsan Khizar',
    'full-stack developer',
    'modern web development',
    'tailwind css',
    'real-time chat',
    'subscription system',
    'task management'
  ],
  authors: [{ name: 'Ahsan Khizar', url: 'https://github.com/ahsankhizar5' }],
  creator: 'Ahsan Khizar',
  publisher: 'Ahsan Khizar',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://freelancehub-saas.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://freelancehub-saas.vercel.app',
    title: 'FreelanceHub - Premium SaaS Freelancing Marketplace by Ahsan Khizar',
    description: 'Professional freelancing marketplace with advanced features: real-time messaging, task management, subscription tiers, and more. Built with Next.js 14 & Supabase.',
    siteName: 'FreelanceHub',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'FreelanceHub - SaaS Freelancing Marketplace by Ahsan Khizar',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FreelanceHub - Premium SaaS Freelancing Marketplace',
    description: 'Professional freelancing platform with real-time features. Built by Ahsan Khizar with Next.js 14 & Supabase.',
    images: ['/og-image.png'],
    creator: '@ahsankhizar5',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code-here',
    // Add your verification codes when deploying
  },
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
