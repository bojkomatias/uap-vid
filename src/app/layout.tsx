import { Footer } from '@layout/Footer'
import { Nav } from '@layout/Nav'
import './globals.css'
import Providers from './providers'
import { Roboto_Flex } from 'next/font/google'
import { getServerSession } from 'next-auth'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { redirect } from 'next/navigation'
import { Breadcrumb } from '@elements/Breadcrumb'
import Navigation from '@auth/Navigation'

export const metadata = {
    title: {
        default: 'UAP - Investigación y Desarrollo',
        template: '$ | VID',
    },
}

const font = Roboto_Flex({ subsets: ['latin'], variable: '--font-sans' })

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession()

    return (
        <html className={`${font.variable} font-sans`}>
            <Providers>
                <body className="subpixel-antialiased">
                    <Nav />
                    <main className="relative min-h-[90vh]">
                        {!session ? (
                            children
                        ) : (
                            // @ts-expect-error
                            <Navigation>
                                <Breadcrumb />
                                {children}
                            </Navigation>
                        )}
                    </main>
                    <Footer />
                </body>
            </Providers>
        </html>
    )
}
