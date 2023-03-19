import { Footer } from '@layout/Footer'
import { Nav } from '@layout/Nav'
import './globals.css'
import Providers from './providers'
import { Roboto_Flex } from 'next/font/google'
import Navigation from '@auth/Navigation'

export const metadata = {
    title: {
        default: 'UAP - Investigación y Desarrollo',
        template: '$ | VID',
    },
}

const font = Roboto_Flex({ subsets: ['latin'], variable: '--font-sans' })

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html className={`${font.variable} font-sans`}>
            <Providers>
                <body className="subpixel-antialiased">
                    <Nav />
                    <main className="relative min-h-[90vh] p-12">
                        {children}
                    </main>
                    <Footer />
                </body>
            </Providers>
        </html>
    )
}
