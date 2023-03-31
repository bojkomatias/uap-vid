import { Footer } from '@layout/c-footer'
import { Nav } from '@layout/c-nav'
import './globals.css'
import Providers from './providers'
import { Catamaran } from 'next/font/google'
import { getServerSession } from 'next-auth'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { SignIn } from '@auth/sign-in'
import Navigation from '@auth/navigation'
import { Breadcrumb } from '@elements/breadcrumb'

export const metadata = {
    title: {
        default: 'UAP - Investigación y Desarrollo',
        template: '$ | VID',
    },
    icons: { icon: '/favicon.ico' },
}

const font = Catamaran({ subsets: ['latin'], variable: '--font-sans' })

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
