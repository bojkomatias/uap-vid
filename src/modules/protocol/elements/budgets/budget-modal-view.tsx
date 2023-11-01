'use client'
import { Button } from '@elements/button'
import { Dialog, Transition } from '@headlessui/react'
import { useState, Fragment, Suspense } from 'react'

export function BudgetModalView({ children }: { children: React.ReactNode }) {
    const [open, setOpen] = useState(false)

    return (
        <Suspense>
            <Button
                className="h-10"
                intent="secondary"
                onClick={() => setOpen(true)}
            >
                Presupuestos Aceptados
            </Button>
            <Transition appear show={open} as={Fragment}>
                <Dialog as="div" className="relative z-50" onClose={setOpen}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black/30" />
                    </Transition.Child>
                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-5xl overflow-hidden rounded-lg bg-white p-6 shadow-xl transition">
                                    {children}
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </Suspense>
    )
}
