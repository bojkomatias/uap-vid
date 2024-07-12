'use client'

import { Dialog, DialogTitle } from '@components/dialog'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { TeamMemberWithCategories } from './categorization-form'
import CategorizationForm from './categorization-form'
import type { TeamMemberCategory } from '@prisma/client'

export function CategorizationDialog({
  categories,
  obreroCategory,
  member,
}: {
  categories: TeamMemberCategory[]
  obreroCategory: TeamMemberCategory
  member: TeamMemberWithCategories
}) {
  const router = useRouter()
  const [open, setOpen] = useState(() => true)

  const closeDialog = () => {
    setOpen(false)
    setTimeout(() => router.back(), 100)
  }

  return (
    <Dialog open={open} onClose={closeDialog} size="2xl">
      <DialogTitle>Categorización de investigador</DialogTitle>
      <CategorizationForm
        member={member}
        categories={categories}
        obreroCategory={obreroCategory}
        onSubmitCallback={closeDialog}
      />
    </Dialog>
  )
}
