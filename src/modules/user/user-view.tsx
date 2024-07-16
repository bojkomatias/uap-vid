'use client'

import type { Prisma } from '@prisma/client'
import { Button } from '@elements/button'
import { Badge } from '@components/badge'
import RolesDictionary from '@utils/dictionaries/RolesDictionary'
import { useState } from 'react'
import CustomDrawer from '@elements/custom-drawer'
type UserWithCount = Prisma.UserGetPayload<{
  include: { _count: true }
}>

export default function UserView({
  userInfo,
  children,
}: {
  userInfo: UserWithCount
  children: React.ReactNode
}) {
  const [opened, setOpened] = useState(false)

  return (
    <>
      <CustomDrawer title="Usuario" open={opened} onClose={setOpened}>
        <section className="flex flex-col gap-4 text-gray-600">
          <div className="flex flex-col gap-3 rounded-md bg-gray-50 px-4 py-3">
            <div className="flex items-end justify-between gap-2">
              <Badge>{userInfo.name}</Badge>
              <p>{RolesDictionary[userInfo.role]}</p>
            </div>
            <div className="flex items-end justify-between gap-2">
              <p>{userInfo.email}</p>
            </div>
            <div className="flex items-end justify-between gap-2">
              <p>Último acceso: </p>
              <p>
                {userInfo.lastLogin?.toLocaleDateString()} {' a las '}
                {userInfo.lastLogin?.toLocaleTimeString()}
              </p>
            </div>
          </div>{' '}
          <div className="flex flex-col gap-3 rounded-md bg-gray-50 px-4 py-3">
            {children}
          </div>
        </section>
      </CustomDrawer>

      <Button
        onClick={() => {
          setOpened(true)
        }}
        intent="secondary"
        size="xs"
      >
        Editar
      </Button>
    </>
  )
}
