'use client'
import React from 'react'
import Image from 'next/image'
import RolesDictionary from '@utils/dictionaries/RolesDictionary'
import CustomDrawer from '@elements/custom-drawer'
import type { User } from '@prisma/client'
import { UserCircle } from 'tabler-icons-react'
import { useCases, type Emailer } from '@utils/emailer'
import { Button } from '@elements/button'

export default async function ProfileDrawer({ user }: { user: User }) {
    return (
        <CustomDrawer title="Perfil de usuario" path="/profile">
            <ProfileInfo user={user} />
        </CustomDrawer>
    )
}

function ProfileInfo({ user }: { user: User }) {
    const updateUserEmail = async ({
        id,
        email,
    }: {
        id: string
        email: string
    }) => {
        fetch(`/api/users`, {
            method: 'PATCH',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, email }),
        })
    }
    const sendEmail = async (emailData: Emailer) => {
        await fetch(`/api/email`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                emailData,
            }),
        })
    }

    return (
        <div className="mt-4 flex flex-col justify-between gap-4 rounded-md border-gray-200 text-gray-600">
            <div>
                {' '}
                <div
                    key={user?.name}
                    className=" flex flex-col gap-10   sm:flex-row"
                >
                    <div className="flex flex-grow items-center gap-x-6">
                        <h3 className=" w-full border-b text-base font-semibold leading-7 tracking-tight text-gray-900">
                            {user.name}
                        </h3>
                        {user.image ? (
                            <Image
                                className="h-12 w-12 rounded-full"
                                src={user.image as string}
                                alt=""
                                height={200}
                                width={200}
                            />
                        ) : (
                            <UserCircle width={48} height={48} />
                        )}
                    </div>
                </div>
                <p className="text-indigo-600 text-sm font-semibold leading-6">
                    {RolesDictionary[user.role]}
                </p>
                <p className="text-indigo-600 text-sm font-semibold leading-6">
                    {user.email}
                </p>
            </div>
            <div className="border-b py-2 text-sm">
                <p>Editar cuenta</p> <input id="newEmail" />
                <Button
                    intent="secondary"
                    onClick={async () => {
                        const email = (
                            document.getElementById(
                                'newEmail'
                            ) as HTMLInputElement
                        ).value
                        console.log(email)
                        const randomString = (Math.random() + 1)
                            .toString(36)
                            .substring(7)
                        console.log('randomString', randomString)

                        await fetch(`/api/email`, {
                            method: 'POST',
                            mode: 'cors',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                email: user.email,
                                randomString: randomString,
                            }),
                        })

                        //updateUserEmail({ id, email })
                    }}
                >
                    Hola
                </Button>
            </div>
        </div>
    )
}
