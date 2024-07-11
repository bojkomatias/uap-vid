'use client'

import type {
  HistoricTeamMemberCategory,
  TeamMember,
  User,
} from '@prisma/client'
import { Dialog, DialogTitle } from '@components/dialog'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import TeamMemberForm from './team-member-form'

export function TeamMemberDialog({
  member,
  researchers,
  academicUnits,
}: {
  member:
    | (TeamMember & {
        categories: HistoricTeamMemberCategory[]
      } & { user: User | null })
    | null
  researchers: User[]
  academicUnits: {
    id: string
    name: string
    shortname: string
  }[]
}) {
  const router = useRouter()
  const [open, setOpen] = useState(() => true)

  const closeDialog = () => {
    setOpen(false)
    setTimeout(() => router.back(), 100)
  }

  return (
    <Dialog open={open} onClose={closeDialog} size="xl">
      <DialogTitle>Miembro de equipo</DialogTitle>

      <TeamMemberForm
        member={member}
        researchers={researchers}
        academicUnits={academicUnits}
      />
    </Dialog>
  )
}
