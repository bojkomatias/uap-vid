'use client'
import { MantineProvider } from '@mantine/core'
import { Notifications } from '@mantine/notifications'
import { SessionProvider } from 'next-auth/react'
import type { ReactNode } from 'react'

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <MantineProvider>
                <Notifications />
                {children}
            </MantineProvider>
        </SessionProvider>
    )
}
