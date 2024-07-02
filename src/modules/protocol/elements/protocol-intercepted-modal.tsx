'use client'
import { Dialog, Transition } from '@headlessui/react'
import { usePathname, useRouter } from 'next/navigation'
import { Fragment } from 'react'

export function ProtocolInterceptedModal({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const path = usePathname()
  const isOpen =
    path.split('/')[1] === 'generate-budget' ||
    path.split('/')[1] === 'anual-budget-view'

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={() => router.back()}>
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
  )
}
