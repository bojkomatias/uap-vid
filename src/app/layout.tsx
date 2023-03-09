import { Footer } from '@layout/Footer'
import { Nav } from '@layout/Nav'
import './globals.css'
import Providers from './providers'
import { Open_Sans } from 'next/font/google'

export const metadata = {
    title: {
        default: 'UAP - Investigación y Desarrollo',
        template: '$ | VID',
    },
}

const font = Open_Sans({ subsets: ['latin'] })

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html className={font.className}>
            <Providers>
                <body className="subpixel-antialiased">
                    <Nav />
                    <main className="mx-auto min-h-[80vh] max-w-6xl p-12 pb-24">
                        {children}
                    </main>
                    <Footer />
                </body>
            </Providers>
        </html>
    )
}
