/* eslint-disable react/no-unescaped-entities */
'use client'
import React, { useState } from 'react'
import Image from 'next/image'
import RolesDictionary from '@utils/dictionaries/RolesDictionary'
import CustomDrawer from '@elements/custom-drawer'
import type { User } from '@prisma/client'
import { Check, Mail, Password, UserCircle, X } from 'tabler-icons-react'
import { notifications } from '@mantine/notifications'
import { Button } from '@elements/button'
import { useForm, zodResolver } from '@mantine/form'
import { UserEmailChangeSchema, UserPasswordChangeSchema } from '@utils/zod'
import DisclosureComponent from '@elements/disclosure'
import Link from 'next/link'

export default function ProfileDrawer({
    certificate,
    user,
}: {
    certificate: React.ReactNode
    user: User
}) {
    return (
        <CustomDrawer title="Perfil de usuario" path="/profile">
            <ProfileInfo certificate={certificate} user={user} />
        </CustomDrawer>
    )
}

export function ProfileInfo({
    certificate,
    user,
}: {
    certificate?: React.ReactNode
    user: User
}) {
    const emailForm = useForm({
        initialValues: {
            currentEmail: user.email,
            newEmail: '',
            emailCode: '',
        },
        validate: zodResolver(UserEmailChangeSchema),
        validateInputOnBlur: true,
    })

    const passwordForm = useForm({
        initialValues: {
            currentPassword: '',
            newPassword: '',
            newPasswordConfirm: '',
        },
        validate: zodResolver(UserPasswordChangeSchema),
        validateInputOnBlur: true,
    })

    // I'm using useState because at some point it might be useful to change the random code. For now, it changes every time the drawer is rendered.
    const [random, ] = useState(
        (Math.random() + 1).toString(36).substring(7)
    )

    const updateUserEmail = async ({
        id,
        email,
    }: {
        id: string
        email: string
    }) => {
        fetch(`/api/users/change-email`, {
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
                    radius: 8,
                    style: {
                        marginBottom: '.8rem',
                    },
                })
            } else {
                notifications.show({
                    title: 'Ocurrió un error',
                    message: 'No se pudo actualizar el Email',
                    color: 'error',
                    icon: <X />,
                    radius: 8,
                    style: {
                        marginBottom: '.8rem',
                    },
                })
            }
            return res
        })
    }
    const updateUserPassword = async ({
        id,
        currentPasswordHash,
        currentPassword,
        newPassword,
    }: {
        id: string
        currentPasswordHash: string
        currentPassword: string
        newPassword: string
    }) => {
        fetch(`/api/users/change-password`, {
            method: 'PATCH',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id,
                currentPasswordHash,
                currentPassword,
                newPassword,
            }),
        }).then((res) => {
            if (res.status == 200) {
                notifications.show({
                    title: 'Se cambió tu contraseña',
                    message: 'Se actualizó tu contraseña con éxito',
                    color: 'success',
                    icon: <Check />,
                    radius: 8,
                    style: {
                        marginBottom: '.8rem',
                    },
                })
            } else {
                notifications.show({
                    title: 'Ocurrió un error',
                    message: 'No se pudo actualizar la contraseña',
                    color: 'error',
                    icon: <X />,
                    radius: 8,
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
                    message:
                        'Revisá tu bandeja de entrada y copiá el código y pegalo en la entrada de texto que dice "código"',
                    color: 'success',
                    icon: <Check />,
                    radius: 8,
                    style: {
                        marginBottom: '.8rem',
                    },
                })
            }
            return res
        })
    }

    return (
        <div className="flex flex-col justify-between gap-4 rounded-md border-gray-200 text-gray-600">
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
            <h3 className="border-b">Editar cuenta</h3>{' '}
            {!user.password ? (
                <Button className="h-10" intent="outline">
                    <Link
                        className="flex-gap flex items-center"
                        href={'https://www.office.com/'}
                    >
                        Editar cuenta en{' '}
                        <Image
                            className=""
                            src={'/whitebackgroundmicrosoft.png'}
                            alt="Microsoft Logo"
                            width={100}
                            height={100}
                        />
                    </Link>
                </Button>
            ) : (
                <>
                    <DisclosureComponent
                        title={
                            <div className="flex items-center gap-2 font-semibold">
                                <Mail height={20} /> Cambiar Email
                            </div>
                        }
                    >
                        <form>
                            <div>
                                <label htmlFor="newEmail" className="label">
                                    Nuevo email
                                </label>
                                <div className="flex w-full gap-2">
                                    <div className="flex-grow">
                                        <input
                                            className="input h-8 text-sm placeholder:lowercase"
                                            placeholder="ejemplo@uap.edu.ar"
                                            id="newEmail"
                                            {...emailForm.getInputProps(
                                                'newEmail'
                                            )}
                                        />

                                        {emailForm.getInputProps('newEmail')
                                            .error ? (
                                            <p className="error">
                                                *
                                                {
                                                    emailForm.getInputProps(
                                                        'newEmail'
                                                    ).error
                                                }
                                            </p>
                                        ) : null}
                                    </div>
                                    <Button
                                        className="h-8 w-fit shadow-sm"
                                        intent="secondary"
                                        onClick={async () => {
                                            if (
                                                !emailForm.getInputProps(
                                                    'newEmail'
                                                ).error
                                            ) {
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
                                    <label
                                        htmlFor="emailCode"
                                        className="label"
                                    >
                                        Código
                                    </label>
                                    <div className="flex w-full flex-col gap-2">
                                        <div className="flex-grow">
                                            <input
                                                className="input h-8 text-sm placeholder:lowercase"
                                                placeholder="Ejemplo: 1qyzy"
                                                id="emailCode"
                                                {...emailForm.getInputProps(
                                                    'emailCode'
                                                )}
                                            />

                                            {emailForm.getInputProps(
                                                'emailCode'
                                            ).error ? (
                                                <p className="error">
                                                    *
                                                    {
                                                        emailForm.getInputProps(
                                                            'emailCode'
                                                        ).error
                                                    }
                                                </p>
                                            ) : null}
                                        </div>
                                    </div>
                                </div>
                                <Button
                                    className=" ml-auto mt-3 h-8 w-fit shadow-sm"
                                    intent="primary"
                                    onClick={async () => {
                                        if (
                                            !emailForm.getInputProps(
                                                'emailCode'
                                            ).error
                                        ) {
                                            await updateUserEmail({
                                                id: user.id,
                                                email: emailForm.getInputProps(
                                                    'newEmail'
                                                ).value,
                                            })
                                        }
                                    }}
                                >
                                    Cambiar email
                                </Button>
                            </div>
                        </form>
                    </DisclosureComponent>
                    <DisclosureComponent
                        title={
                            <div className="flex items-center gap-2 font-semibold">
                                <Password width={20} />
                                Cambiar Contraseña
                            </div>
                        }
                    >
                        <form className="flex flex-col gap-6">
                            {' '}
                            <div>
                                {' '}
                                <label
                                    htmlFor="currentPassword"
                                    className="label"
                                >
                                    Contraseña actual
                                </label>
                                <div className="flex w-full gap-2">
                                    <div className="flex-grow">
                                        <input
                                            type="password"
                                            className="input h-8 text-sm placeholder:lowercase"
                                            placeholder="••••••••••••••"
                                            id="currentPassword"
                                            {...passwordForm.getInputProps(
                                                'currentPassword'
                                            )}
                                        />

                                        {passwordForm.getInputProps(
                                            'currentPassword'
                                        ).error ? (
                                            <p className="error">
                                                *
                                                {
                                                    passwordForm.getInputProps(
                                                        'currentPassword'
                                                    ).error
                                                }
                                            </p>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                            <div>
                                {' '}
                                <label htmlFor="newPassword" className="label">
                                    Nueva contraseña
                                </label>
                                <div className="flex w-full gap-2">
                                    <div className="flex-grow">
                                        <input
                                            type="password"
                                            className="input h-8 text-sm placeholder:lowercase"
                                            placeholder="••••••••••••••"
                                            id="newPassword"
                                            {...passwordForm.getInputProps(
                                                'newPassword'
                                            )}
                                        />

                                        {passwordForm.getInputProps(
                                            'newPassword'
                                        ).error ? (
                                            <p className="error">
                                                *
                                                {
                                                    passwordForm.getInputProps(
                                                        'newPassword'
                                                    ).error
                                                }
                                            </p>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                            <div>
                                {' '}
                                <label
                                    htmlFor="newPasswordConfirm"
                                    className="label"
                                >
                                    Confirmar nueva contraseña
                                </label>
                                <div className="flex w-full gap-2">
                                    <div className="flex-grow">
                                        <input
                                            type="password"
                                            className="input h-8 text-sm placeholder:lowercase"
                                            placeholder="••••••••••••••"
                                            id="newPasswordConfirm"
                                            {...passwordForm.getInputProps(
                                                'newPasswordConfirm'
                                            )}
                                        />

                                        {passwordForm.getInputProps(
                                            'newPasswordConfirm'
                                        ).error ? (
                                            <p className="error">
                                                *
                                                {
                                                    passwordForm.getInputProps(
                                                        'newPasswordConfirm'
                                                    ).error
                                                }
                                            </p>
                                        ) : null}
                                    </div>
                                </div>
                            </div>
                            <Button
                                className=" ml-auto h-8 w-fit shadow-sm"
                                intent="primary"
                                onClick={async () => {
                                    await updateUserPassword({
                                        id: user.id,
                                        currentPasswordHash: user.password!,
                                        currentPassword:
                                            passwordForm.getInputProps(
                                                'currentPassword'
                                            ).value,
                                        newPassword:
                                            passwordForm.getInputProps(
                                                'newPassword'
                                            ).value,
                                    })
                                }}
                            >
                                Cambiar contraseña
                            </Button>
                        </form>
                    </DisclosureComponent>
                </>
            )}
            {certificate}
        </div>
    )
}
