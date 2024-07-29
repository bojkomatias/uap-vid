'use client'
import { usePathname, useRouter } from 'next/navigation'
import { Dialog } from '@headlessui/react'
import { Heading } from '@components/heading'

/**This drawer takes 2 required arguments: title and children, the title will be, well, the title of the drawer and the children can be anything that goes inside it, forms, static elements, etc. The path argument is needed when the drawer will be consumed by an intercepted route (server side), otherwise, an "open" argument will be needed, to open and close the drawer in the client*/
export default function CustomDrawer({
  path,
  title,
  children,
  open,
  onClose,
}: {
  path?: string
  title: string
  children: React.ReactNode
  open?: boolean
  onClose?: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const pathname = usePathname()
  const router = useRouter()

  function closeModal() {
    document.getElementById('drawer-overlay')?.classList.add('fade-out')
    document.getElementById('drawer-content')?.classList.add('fade-out-right')
    path &&
      setTimeout(() => {
        router.back()
      }, 500)
    onClose &&
      setTimeout(() => {
        onClose(false)
      }, 300)
  }

  return (
    <>
      <Dialog
        open={open ? open : pathname == path}
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
            <Dialog.Panel className="h-screen w-full max-w-lg transform overflow-hidden bg-white p-6 text-left align-middle shadow-md transition-all dark:bg-gray-800">
              <Heading>{title}</Heading>
              <div className="mt-2 rounded-md ">{children}</div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </>
  )
}
