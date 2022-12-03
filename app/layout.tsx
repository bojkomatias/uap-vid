import Footer from '@layout/Footer'
import Nav from '@layout/Nav'
import '../styles/globals.css'

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html>
            <head />
            <body>
                <Nav />
                <main className="mx-auto my-12 min-h-[70vh] w-[500px] scale-[75%] opacity-100 transition-all duration-150 xl:scale-[85%] 2xl:my-24 2xl:scale-100">
                    {children}
                </main>
                <Footer />
            </body>
        </html>
    )
}
