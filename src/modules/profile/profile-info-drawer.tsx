'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import RolesDictionary from '@utils/dictionaries/RolesDictionary'
import CustomDrawer from '@elements/custom-drawer'
import type { User } from '@prisma/client'
import { Check, UserCircle } from 'tabler-icons-react'

import { notifications } from '@mantine/notifications'
import { Button } from '@elements/button'
import { useForm, zodResolver } from '@mantine/form'
import { UserEmailChangeSchema } from '@utils/zod'

export default async function ProfileDrawer({ user }: { user: User }) {
    return (
        <CustomDrawer title="Perfil de usuario" path="/profile">
            <ProfileInfo user={user} />
        </CustomDrawer>
    )
}

function ProfileInfo({ user }: { user: User }) {
    const form = useForm({
        initialValues: {
            previousEmail: user.email,
            newEmail: '',
            emailCode: '',
        },
        validate: zodResolver(UserEmailChangeSchema),
        validateInputOnBlur: true,
    })

    const [random, setRandom] = useState(
        (Math.random() + 1).toString(36).substring(7)
    )

    const updateUserEmail = async ({
        id,
        email,
    }: {
        id: string
        email: string
    }) => {
        fetch(`/api/users/edit-email`, {
            method: 'PATCH',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, email }),
        }).then((res) => {
            if (res.status == 200) {
                notifications.show({
                    title: 'Se cambió tu Email',
                    message:
                        'Vas a ver los cambios cuando vuelvas a iniciar sesión',
                    color: 'success',
                    icon: <Check />,
                    radius: 0,
                    style: {
                        marginBottom: '.8rem',
                    },
                })
            } else {
                notifications.show({
                    title: 'Ocurrió un error',
                    message: 'No se pudo actualizar el Email',
                    color: 'success',
                    icon: <Check />,
                    radius: 0,
                    style: {
                        marginBottom: '.8rem',
                    },
                })
            }
            return res
        })
    }
    const sendEmail = async ({
        email,
        randomString,
    }: {
        email: string
        randomString: string
    }) => {
        return await fetch(`/api/email`, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email,
                randomString,
            }),
        }).then((res) => {
            if (res.status == 200) {
                notifications.show({
                    title: 'Se envió un código a tu Email',
                    message: 'Revisá tu bandeja de entrada y copiá el código',
                    color: 'success',
                    icon: <Check />,
                    radius: 0,
                    style: {
                        marginBottom: '.8rem',
                    },
                })
            }
            return res
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
            <div className="py-2 text-sm">
                <p className="border-b">Editar cuenta</p>{' '}
                <form>
                    <div className="my-2">
                        <label htmlFor="newEmail" className="label">
                            Nuevo email
                        </label>
                        <div className="flex w-full gap-2">
                            <div className="flex-grow">
                                <input
                                    className="input h-8 text-sm placeholder:lowercase"
                                    placeholder="ejemplo@uap.edu.ar"
                                    id="newEmail"
                                    {...form.getInputProps('newEmail')}
                                />

                                {form.getInputProps('newEmail').error ? (
                                    <p className="error">
                                        *{form.getInputProps('newEmail').error}
                                    </p>
                                ) : null}

                                {
                                    //This shit isn't working, I'll leave it like this for now and I'll fix it later
                                    form.getInputProps('emailsNotEqual')
                                        .error ? (
                                        <p className="error">
                                            *
                                            {
                                                form.getInputProps(
                                                    'emailsNotEqual'
                                                ).error
                                            }
                                        </p>
                                    ) : null
                                }
                            </div>
                            <Button
                                className="h-8 w-fit shadow-sm"
                                intent="secondary"
                                onClick={async () => {
                                    if (!form.getInputProps('newEmail').error) {
                                        await sendEmail({
                                            email: user.email,
                                            randomString: random!,
                                        })

                                        document
                                            .getElementById(
                                                'emailCodeConfirmation'
                                            )
                                            ?.classList.remove('hidden')
                                        document
                                            .getElementById(
                                                'emailCodeConfirmation'
                                            )
                                            ?.classList.add('fade-in')
                                    }
                                }}
                            >
                                Confirmar
                            </Button>
                        </div>
                    </div>
                    <div id="emailCodeConfirmation" className="hidden">
                        <div className="my-2">
                            <label htmlFor="emailCode" className="label">
                                Código
                            </label>
                            <div className="flex w-full flex-col gap-2">
                                <div className="flex-grow">
                                    <input
                                        className="input h-8 text-sm placeholder:lowercase"
                                        placeholder="Ejemplo: 1qyzy"
                                        id="emailCode"
                                        {...form.getInputProps('emailCode')}
                                    />

                                    {form.getInputProps('emailCode').error ? (
                                        <p className="error">
                                            *
                                            {
                                                form.getInputProps('emailCode')
                                                    .error
                                            }
                                        </p>
                                    ) : null}
                                </div>
                            </div>
                        </div>
                        <Button
                            className="float-right mt-1 h-8 w-fit shadow-sm"
                            intent="primary"
                            onClick={async () => {
                                console.log(
                                    form.getInputProps('newEmail').value
                                )
                                if (!form.getInputProps('emailCode').error) {
                                    await updateUserEmail({
                                        id: user.id,
                                        email: form.getInputProps('newEmail')
                                            .value,
                                    })
                                }
                            }}
                        >
                            Cambiar email
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    )
}
