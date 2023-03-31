import { Footer } from '@layout/footer'
import { Header } from '@layout/header'
import './globals.css'
import Providers from './providers'
import { Catamaran } from 'next/font/google'
import { getServerSession } from 'next-auth'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { SignIn } from '@auth/sign-in'
import Navigation from '@auth/navigation'
import { Breadcrumbs } from '@elements/breadcrumbs'

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
                    <Header />
                    <main className="relative min-h-[90vh]">
                        {session ? (
                            <Navigation session={session}>
                                <Breadcrumbs />
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
