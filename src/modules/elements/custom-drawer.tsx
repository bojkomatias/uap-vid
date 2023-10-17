'use client'
import { Drawer } from '@mantine/core'
import { usePathname, useRouter } from 'next/navigation'

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

    const closeFn = () => {
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
            onClose={() => closeFn()}
        >
            <Drawer.Overlay id="drawer-overlay" className="fade-in" />
            <Drawer.Content id="drawer-content" className="fade-in-right">
                <Drawer.Header>
                    <Drawer.Title className="font-semibold text-gray-600">
                        {title}
                    </Drawer.Title>
                    <Drawer.CloseButton />
                </Drawer.Header>
                <Drawer.Body className="mx-3 rounded-md border border-gray-100 bg-gray-50 shadow-md">
                    {children}
                </Drawer.Body>
            </Drawer.Content>
        </Drawer.Root>
    )
}

import { Dialog } from '@headlessui/react'
import { Fragment, useState } from 'react'

export function CustomDrawer2({
    path,
    title,
    children,
}: {
    path: string
    title: string
    children: React.ReactNode
}) {
    const pathname = usePathname()
    const [isOpen, setIsOpen] = useState(pathname == path)

    function closeModal() {
        setIsOpen(false)
    }

    return (
        <>
            <Dialog
                open={isOpen}
                as="div"
                className="fixed z-50 h-screen w-screen"
                onClose={closeModal}
            >
                <div className="fixed inset-0 bg-black bg-opacity-25" />

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4 text-center">
                        <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                            <Dialog.Title
                                as="h3"
                                className="text-lg font-medium leading-6 text-gray-900"
                            >
                                {title}
                            </Dialog.Title>
                            <div className="mt-2">{children}</div>

                            <div className="mt-4">
                                <button
                                    type="button"
                                    className="border-transparent bg-blue-100 text-blue-900 hover:bg-blue-200 focus-visible:ring-blue-500 inline-flex justify-center rounded-md border px-4 py-2 text-sm font-medium focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
                                    onClick={closeModal}
                                >
                                    Got it, thanks!
                                </button>
                            </div>
                        </Dialog.Panel>
                    </div>
                </div>
            </Dialog>
        </>
    )
}
