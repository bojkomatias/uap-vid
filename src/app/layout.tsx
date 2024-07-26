import './globals.css'
import { Montserrat } from 'next/font/google'
import Providers from './providers'

export const metadata = {
  title: {
    default: 'UAP - Investigación y Desarrollo',
    template: '$ | VID',
  },
  icons: { icon: '/favicon.ico' },
}

const font = Montserrat({ subsets: ['latin'], variable: '--font-sans' })

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html className={`${font.variable} font-sans antialiased`}>
      <head>
        <script src="/dark-mode.js" async />
      </head>
      {process.env.NEXTAUTH_URL === 'https://uap-vid.vercel.app' ?
        <div className="pointer-events-none fixed inset-0 z-50 bg-transparent backdrop-hue-rotate-60">
          <div className="fixed inset-x-0 top-0 -mt-1 h-6 bg-black/90 text-center text-lg font-black text-white">
            TESTING
          </div>
        </div>
      : null}
      <body>
        <div id="notifications-container" className="relative" />
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
