import './globals.css'
import { Footer } from '@layout/footer'
import { Header } from '@layout/header'
import { Montserrat } from 'next/font/google'
import { MantineProvider } from '@mantine/core'

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
            {process.env.NEXTAUTH_URL === 'https://uap-vid.vercel.app' ? (
                <>
                    <div className="bg-black/90 text-center text-lg font-black text-white">
                        TESTING
                    </div>
                    <div className="bg-transparent pointer-events-none fixed inset-0 z-50 backdrop-hue-rotate-60" />
                </>
            ) : null}
            <body className="subpixel-antialiased">
                <MantineProvider>
                    <Header />
                    <main className="relative min-h-[90vh]">{children}</main>
                    <Footer />
                </MantineProvider>
            </body>
        </html>
    )
}
