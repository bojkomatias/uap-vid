'use client'
import { Button } from '@elements/Button'
import { useForm } from '@mantine/form'
import { usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { zodResolver } from '@mantine/form'
import { Review, ReviewSchema } from '@utils/zod'
import { useNotifications } from '@mantine/notifications'
import { Check, X } from 'tabler-icons-react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
const Tiptap = dynamic(() => import('@elements/TipTap'))

export default function ReviewForm({ review }: { review: Review }) {
    const path = usePathname()
    const protocolId = path?.split('/')[2]
    const router = useRouter()
    const form = useForm<Review>({
        initialValues: review,
        validate: zodResolver(ReviewSchema),
        validateInputOnChange: true,
    })
    const notifications = useNotifications()

    const addReview = useCallback(async (comment: string) => {
        const res = await fetch(`/api/reviews/${protocolId}`, {
            method: 'PUT',
            body: JSON.stringify(comment),
        })
        if (res.status == 200) {
            notifications.showNotification({
                title: 'Revision publicada',
                message: 'Tu revision fue correctamente publicada.',
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
                message: 'Hubo un problema al publicar tu revision.',
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
                // createComment(values.data)
                console.log(values)
            })}
        >
            <label className="label">Comentario</label>
            <Tiptap {...form.getInputProps('data')} />
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
