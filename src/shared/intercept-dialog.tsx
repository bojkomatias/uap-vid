'use client'

import { Dialog, type DialogProps } from '@components/dialog'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'

/** Intercepts routes to render a modal then gracefully closes
    @param intercept: Route to intercept
    @param push: Route to push back to on close

    Push can be any path, but will usually be the one you triggered the dialog from
*/
export function InterceptDialog({
  children,
  intercept,
  push,
  ...props
}: {
  intercept: string
  push: string
} & Omit<DialogProps, 'onClose' | 'open'>) {
  const router = useRouter()
  const pathname = usePathname()

  const [open, setOpen] = useState(true)

  const closeDialog = useCallback(() => {
    setTimeout(() => {
      setOpen(false)
      router.push(push)
    }, 100)
  }, [router, push])

  useEffect(() => {
    if (pathname === intercept) setOpen(true)
    else closeDialog()
    return () => {}
  }, [pathname, intercept, closeDialog])

  return (
    <Dialog {...props} open={open} onClose={closeDialog}>
      {children}
    </Dialog>
  )
}
