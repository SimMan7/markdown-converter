import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Free Markdown to PDF and Word Converter | convertmdtopdf.online',
  description: 'Convert your Markdown files to PDF and Word documents instantly. Free online tool with real-time preview and no registration required. Perfect for developers, writers, and anyone who works with Markdown files.',
  keywords: 'markdown to pdf converter, markdown to word, markdown preview online, free document converter, pdf converter',
  authors: [{ name: 'convertmdtopdf.online' }],
  creator: 'convertmdtopdf.online',
  publisher: 'convertmdtopdf.online',
  robots: 'index, follow',
  openGraph: {
    title: 'Free Markdown to PDF and Word Converter',
    description: 'Convert your Markdown files to PDF and Word documents instantly. Free online tool with real-time preview.',
    url: 'https://convertmdtopdf.online',
    siteName: 'convertmdtopdf.online',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Markdown to PDF and Word Converter',
    description: 'Convert your Markdown files to PDF and Word documents instantly. Free online tool with real-time preview.',
  },
  alternates: {
    canonical: 'https://convertmdtopdf.online',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        {/* Google tag (gtag.js) */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-QFVT5ZXLQ2"></script>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-QFVT5ZXLQ2');
            `,
          }}
        />
        
        {/* Google AdSense */}
        <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6865885814212781" crossOrigin="anonymous"></script>
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}
