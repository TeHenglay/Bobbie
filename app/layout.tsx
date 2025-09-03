import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bobbie - Your AI Companion 🤖',
  description: 'Chat with Bobbie, your intelligent AI companion for conversations, assistance, and more. Built with Next.js and TypeScript.',
  generator: 'v0.app',
  keywords: ['AI', 'Chatbot', 'Assistant', 'Bobbie', 'Conversation', 'Next.js'],
  authors: [{ name: 'TeHenglay' }],
  icons: {
    icon: [
      { url: '/images/bobbie-profile.png', sizes: '32x32', type: 'image/png' },
      { url: '/images/bobbie-profile.png', sizes: '16x16', type: 'image/png' },
    ],
    shortcut: '/images/bobbie-profile.png',
    apple: '/images/bobbie-profile.png',
  },
  openGraph: {
    title: 'Bobbie - Your AI Companion',
    description: 'Chat with Bobbie, your intelligent AI companion for conversations, assistance, and more.',
    images: ['/images/bobbie-banner.png'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
