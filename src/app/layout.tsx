import './globals.css'
import { Footer } from '@layout/footer'
import { Header } from '@layout/header'
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
        <html className={`${font.variable} font-sans`}>
            <Providers>
                <body className="subpixel-antialiased">
                    <Header />
                    <main className="relative min-h-[90vh]">{children}</main>
                    <Footer />
                </body>
            </Providers>
        </html>
    )
}
