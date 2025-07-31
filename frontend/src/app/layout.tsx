import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme/ThemeProvider'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: '0Nap - Cold Start Prevention Service',
  description: 'Prevent cold starts on your serverless deployments with automated health checks and monitoring.',
  keywords: ['serverless', 'cold start', 'monitoring', 'render', 'vercel', 'railway'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="./favicon.ico" sizes='any'/>
        {/* Cloudflare Turnstile CAPTCHA */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.onloadTurnstileCallback = function () {
                // Turnstile is ready
                console.log('Cloudflare Turnstile loaded successfully');
              };
            `,
          }}
        />
        <script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback" 
          async 
          defer
        />
      </head>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
