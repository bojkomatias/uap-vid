'use client'

import { Dialog, DialogDescription, DialogTitle } from '@components/dialog'
import { ReactNode, useState } from 'react'

import { useRouter } from 'next/navigation'

export function GenerateAnualBudgetDialog({
  children,
}: {
  children: ReactNode
}) {
  const router = useRouter()
  const [open, setOpen] = useState(() => true)

  const closeDialog = () => {
    setOpen(false)
    setTimeout(() => router.back(), 100)
  }

  return (
    <Dialog open={open} onClose={closeDialog} size="2xl">
      <DialogTitle>Generar presupuesto anual</DialogTitle>

      <DialogDescription>Jijo</DialogDescription>
      {children}
    </Dialog>
  )
}
