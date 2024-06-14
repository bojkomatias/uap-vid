import { Button } from '@components/ui/button'
import './globals.css'
import { Footer } from '@layout/footer'
import { Header } from '@layout/header'
import { Montserrat } from 'next/font/google'

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
            {process.env.NEXTAUTH_URL === 'https://uap-vid.vercel.app' ? (
                <div className="bg-transparent pointer-events-none fixed inset-0 z-50 backdrop-hue-rotate-60">
                    <div className="fixed inset-x-0 top-0 -mt-1 h-6 bg-black/90 text-center text-lg font-black text-white">
                        TESTING
                    </div>
                </div>
            ) : null}
            <body>
                <div id="notifications-container" className="relative" />
                <Header />
                <div className="relative min-h-screen">{children}</div>
                <Footer />
            </body>
        </html>
    )
}
