'use client'
import { usePathname, useRouter } from 'next/navigation'
import { Dialog } from '@headlessui/react'

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

    function closeModal() {
        document.getElementById('drawer-overlay')?.classList.add('fade-out')
        document
            .getElementById('drawer-content')
            ?.classList.add('fade-out-right')
        setTimeout(() => {
            router.back()
        }, 500)
    }

    return (
        <>
            <Dialog
                open={pathname == path}
                as="div"
                className="fixed z-50 h-screen w-screen"
                onClose={closeModal}
            >
                <div
                    id="drawer-overlay"
                    className="fade-in fixed inset-0 bg-black bg-opacity-25"
                />

                <div
                    id="drawer-content"
                    className="fade-in-right fixed inset-0 overflow-y-auto"
                >
                    <div className="flex items-center justify-end text-center">
                        <Dialog.Panel className="h-screen w-full max-w-md transform overflow-hidden bg-white p-6 text-left align-middle shadow-xl transition-all">
                            <Dialog.Title className="font-semibold text-gray-600">
                                {title}
                            </Dialog.Title>
                            <div className="mt-2 rounded-md border border-gray-100 bg-gray-50 p-4 pb-6 shadow-md">
                                {children}
                            </div>
                        </Dialog.Panel>
                    </div>
                </div>
            </Dialog>
        </>
    )
}
