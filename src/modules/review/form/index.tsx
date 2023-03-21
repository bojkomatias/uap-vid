'use client'
import { Button } from '@elements/Button'
import { useForm } from '@mantine/form'
import { usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { zodResolver } from '@mantine/form'
import { CommentSchema } from '@utils/zod'
import { useNotifications } from '@mantine/notifications'
import { Check, X } from 'tabler-icons-react'
import { useRouter } from 'next/navigation'
import { protocol, Role, user } from '@prisma/client'
import CommentButton from '@review/action-buttons/comment'
import { useState } from 'react'
import { Transition } from '@headlessui/react'

export default function ReviewForm({
    reviewer,
    protocol,
}: {
    reviewer: user
    protocol: protocol
}) {
    const path = usePathname()
    const protocolId = path?.split('/')[2]
    console.log(protocolId)
    const router = useRouter()
    const form = useForm({
        initialValues: { data: '' },
        validate: zodResolver(CommentSchema),
        validateInputOnBlur: true,
    })
    const notifications = useNotifications()
    const [comment, setComment] = useState(false)

    const createComment = useCallback(async (comment: string) => {
        const res = await fetch(`/api/reviews/${protocolId}`, {
            method: 'PUT',
            body: JSON.stringify(comment),
        })
        if (res.status == 200) {
            notifications.showNotification({
                title: 'Comentario publicado',
                message: 'Tu comentario fue correctamente publicado.',
                color: 'teal',
                icon: <Check />,
                radius: 0,
                style: {
                    marginBottom: '.8rem',
                },
            })
            form.reset()
            router.refresh()
        } else {
            notifications.showNotification({
                title: 'Ocurrió un error',
                message: 'Hubo un problema al publicar tu comentario.',
                color: 'red',
                icon: <X />,
                radius: 0,
                style: {
                    marginBottom: '.8rem',
                },
            })
        }
        console.log(res)
    }, [])

    return (
        <>
            <CommentButton
                role={reviewer.role}
                protocol={protocol}
                commentState={comment}
                action={() => {
                    setComment(!comment)
                    form.clearErrors()
                }}
            />
            <div className="relative mb-2 z-50">
                <Transition
                    show={comment}
                    enter="transition-all duration-200 z-50"
                    enterFrom="opacity-0 -translate-y-10 z-50"
                    enterTo="opacity-100 translate-y-0 z-50"
                    leave="transition-all duration-300 z-50"
                    leaveFrom="opacity-100 z-50"
                    leaveTo="opacity-0 z-50 "
                >
                    <div className="absolute mt-2 z-[99] right-0 w-full rounded-lg bg-white">
                        <form
                            className="shadow-lg p-4"
                            onSubmit={form.onSubmit((values) => {
                                createComment(values.data)
                            })}
                        >
                            <textarea
                                rows={7}
                                className="input text-sm transition-all duration-150"
                                {...form.getInputProps('data')}
                            />
                            <p className="pt-1 animate-pulse pl-3 text-xs text-gray-600 saturate-[80%]">
                                {form.errors.data
                                    ? `* ${form.errors.data} `
                                    : null}
                            </p>

                            <Button
                                type="submit"
                                className="mt-2 ml-auto"
                                intent="terciary"
                            >
                                Comentar
                            </Button>
                        </form>
                    </div>
                </Transition>
            </div>
        </>
    )
}
