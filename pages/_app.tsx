import '../styles/globals.css'
import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import Layout from '../components/Layout'
import { SessionProvider } from 'next-auth/react'
'
import { NotificationsProvider } from '@mantine/notifications'

type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

export default function MyApp({
    Component,
    pageProps: { session, ...pageProps },
}: AppPropsWithLayout) {
    // Use the layout defined at the page level, if available
    const getLayout = Component.getLayout ?? ((page) => page)

    return getLayout(
        <>
            <SessionProvider session={session}>
                <NotificationsProvider>
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </NotificationsProvider>
            </SessionProvider>
        </>
    )
}
