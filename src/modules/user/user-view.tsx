'use client'
import { useDisclosure } from '@mantine/hooks'
import { Drawer, Group } from '@mantine/core'
import type { Prisma, User } from '@prisma/client'
import { Button } from '@elements/button'
import { Badge } from '@elements/badge'
import RolesDictionary from '@utils/dictionaries/RolesDictionary'
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
    const [opened, { open, close }] = useDisclosure(false)

    return (
        <>
            <Drawer
                className="absolute text-sm "
                position="right"
                opened={opened}
                onClose={close}
            >
                <section className="flex flex-col gap-4 text-gray-600">
                    <div className="flex flex-col gap-3 rounded-md bg-gray-50 p-6 shadow-md">
                        <div className="flex items-end justify-between gap-2">
                            <Badge className="text-sm">{userInfo.name}</Badge>
                            <p>{RolesDictionary[userInfo.role]}</p>
                        </div>
                        <div className="flex items-end justify-between gap-2">
                            <p>{userInfo.email}</p>
                        </div>
                        <div className="flex items-end justify-between gap-2">
                            <p>Último acceso: </p>
                            <p>
                                {userInfo.lastLogin?.toLocaleDateString()}{' '}
                                {' a las '}
                                {userInfo.lastLogin?.toLocaleTimeString()}
                            </p>
                        </div>
                    </div>{' '}
                    <div className="flex flex-col gap-3 rounded-md bg-gray-50 p-6 shadow-md">
                        {children}
                    </div>
                </section>
            </Drawer>

            <Group position="center">
                <Button
                    id="historic-prices-id"
                    className="px-2.5 py-1 text-xs"
                    onClick={open}
                    intent="secondary"
                >
                    Editar
                </Button>
            </Group>
        </>
    )
}
