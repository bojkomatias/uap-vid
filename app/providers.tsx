'use client'
import { MantineProvider } from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'
import { SessionProvider } from 'next-auth/react'
import { ReactNode } from 'react'

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <MantineProvider>
                <NotificationsProvider>{children}</NotificationsProvider>
            </MantineProvider>
        </SessionProvider>
    )
}
