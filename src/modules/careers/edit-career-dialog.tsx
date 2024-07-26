'use client'

import type { Career, Course } from '@prisma/client'
import { Dialog, DialogDescription, DialogTitle } from '@components/dialog'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { CareerForm } from './career-form'
import { Subheading } from '@components/heading'

export function EditCareerDialog({
  career,
}: {
  career: Career & { courses: Course[] }
}) {
  const router = useRouter()
  const [open, setOpen] = useState(() => true)

  const closeDialog = () => {
    setOpen(false)
    setTimeout(() => router.back(), 100)
  }

  return (
    <Dialog open={open} onClose={closeDialog} size="2xl">
      <div className="flex items-center gap-2">
        <DialogTitle>{career.name}</DialogTitle>
      </div>
      <DialogDescription>
        Tenga en cuenta que esto puede afectar al resto de la applicación
      </DialogDescription>
      <CareerForm career={career} onSubmitCallback={closeDialog} />
    </Dialog>
  )
}
