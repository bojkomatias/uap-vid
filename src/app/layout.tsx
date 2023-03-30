import { Footer } from '@layout/Footer'
import { Nav } from '@layout/Nav'
import './globals.css'
import Providers from './providers'
import { Roboto_Flex } from 'next/font/google'
import { getServerSession } from 'next-auth'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { SignIn } from '@auth/SignIn'
import Navigation from '@auth/Navigation'
import { Breadcrumb } from '@elements/Breadcrumb'

export const metadata = {
    title: {
        default: 'UAP - Investigación y Desarrollo',
        template: '$ | VID',
    },
    icons: { icon: '/UAPazul.png' },
}

const font = Roboto_Flex({ subsets: ['latin'], variable: '--font-sans' })

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)

    return (
        <html className={`${font.variable} font-sans`}>
            <Providers>
                <body className="subpixel-antialiased">
                    <Nav />
                    <main className="relative min-h-[90vh]">
                        {session ? (
                            <Navigation session={session}>
                                <Breadcrumb />
                                {children}
                            </Navigation>
                        ) : (
                            <SignIn />
                        )}
                    </main>
                    <Footer />
                </body>
            </Providers>
        </html>
    )
}
