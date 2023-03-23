'use client'
import { Button } from '@elements/Button'
import { useForm } from '@mantine/form'
import { usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { zodResolver } from '@mantine/form'
import { CommentSchema, StateType } from '@utils/zod'
import { useNotifications } from '@mantine/notifications'
import { Check, X } from 'tabler-icons-react'
import { useRouter } from 'next/navigation'
import { User } from '@prisma/client'
import { useState } from 'react'
import RichTextEditor from '@elements/RTE'

export default function ReviewForm({ reviewer }: { reviewer: User }) {
    const path = usePathname()
    const protocolId = path?.split('/')[2]
    const router = useRouter()
    const form = useForm({
        initialValues: { data: '' },
        validate: zodResolver(CommentSchema),
        validateInputOnBlur: true,
    })
    const notifications = useNotifications()
    const [comment, setComment] = useState(true)

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
        <form
            className="p-2 w-[27rem]"
            onSubmit={form.onSubmit((values) => {
                createComment(values.data)
            })}
        >
            <label className="label">Comentario</label>
            <RichTextEditor
                {...form.getInputProps('data')}
                className="input h-auto min-h-[20rem] overflow-y-auto pt-0 border-gray-200"
                placeholder={''}
                sticky={true}
                radius={0}
                controls={[
                    ['bold', 'italic', 'underline'],
                    ['alignLeft', 'alignCenter', 'alignRight'],
                    ['h1', 'h2', 'h3'],
                    ['link'],
                ]}
            />
            {form.getInputProps('data').error ? (
                <p className=" pt-1 pl-3 text-xs text-gray-600 saturate-[80%]">
                    *{form.getInputProps('data').error}
                </p>
            ) : null}

            <Button type="submit" className="mt-2 ml-auto" intent="terciary">
                Comentar
            </Button>
        </form>
    )
}
