'use client'
import { Button } from '@elements/Button'
import { useForm } from '@mantine/form'
import { useCallback, useMemo } from 'react'
import { zodResolver } from '@mantine/form'
import { ReviewSchema } from '@utils/zod'
import { useNotifications } from '@mantine/notifications'
import { Check, X } from 'tabler-icons-react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Review } from '@prisma/client'
const Tiptap = dynamic(() => import('@elements/TipTap'))

export default function ReviewForm({ review }: { review: Review }) {
    const router = useRouter()
    const form = useForm<Review>({
        initialValues: review,
        validate: zodResolver(ReviewSchema),
        validateInputOnChange: true,
    })
    const notifications = useNotifications()

    const addReview = useCallback(async () => {
        const res = await fetch(`/api/review/${review.id}`, {
            method: 'PUT',
            body: JSON.stringify({ updatedReview }),
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

    const updatedReview = useMemo(() => {
        return { ...review, data: form.values.data }
    }, [form.values.data, review])

    return (
        <form
            className="p-2 w-[27rem]"
            onSubmit={form.onSubmit((values) => {
                // addReview(values.data)
                console.log(updatedReview)
            })}
        >
            <label className="label">Comentario</label>
            <Tiptap {...form.getInputProps('data')} /> */}
            {form.getInputProps('data').error ? (
                <p className=" pt-1 pl-3 text-xs text-gray-600 saturate-[80%]">
                    *{form.getInputProps('data').error}
                </p>
            ) : null}

            <Button type="submit" className="mt-2 ml-auto" intent="terciary">
                Comentar
            </Button>
            <div>{updatedReview}</div>
        </form>
    )
}
