import Footer from '@layout/Footer'
import Nav from '@layout/Nav'
import '../styles/globals.css'
import Providers from './providers'

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html>
            <head />
            <Providers>
                <body>
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
