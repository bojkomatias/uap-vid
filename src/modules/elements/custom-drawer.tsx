'use client'
import { Drawer } from '@mantine/core'
import { usePathname, useRouter } from 'next/navigation'

import type { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime'

export default function CustomDrawer({
    path,
    title,
    children,
}: {
    path: string
    title: string
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const router = useRouter()

    const closeFn = (router: AppRouterInstance) => {
        document.getElementById('drawer-overlay')?.classList.add('fade-out')
        document
            .getElementById('drawer-content')
            ?.classList.add('fade-out-right')
        setTimeout(() => {
            router.back()
        }, 300)
    }

    return (
        <Drawer.Root
            closeOnEscape
            position="right"
            opened={pathname == path}
            onClose={() => closeFn(router)}
        >
            <Drawer.Overlay id="drawer-overlay" className="fade-in" />
            <Drawer.Content id="drawer-content" className="fade-in-right">
                <Drawer.Header>
                    <Drawer.Title className="font-semibold text-gray-600">
                        {title}
                    </Drawer.Title>
                    <Drawer.CloseButton />
                </Drawer.Header>
                <Drawer.Body className="mx-3 rounded-md bg-gray-50 p-10 shadow-md">
                    {children}
                </Drawer.Body>
            </Drawer.Content>
        </Drawer.Root>
    )
}
