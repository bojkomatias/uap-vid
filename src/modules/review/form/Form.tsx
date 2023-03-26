'use client'
import { Button } from '@elements/Button'
import { useForm } from '@mantine/form'
import { usePathname } from 'next/navigation'
import { useCallback } from 'react'
import { zodResolver } from '@mantine/form'
import { ReviewSchema } from '@utils/zod'
import { useNotifications } from '@mantine/notifications'
import { Check, X } from 'tabler-icons-react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Review } from '@prisma/client'
import { RadioGroup } from '@headlessui/react'
import clsx from 'clsx'
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
            <RadioGroup {...form.getInputProps('veredict')}>
                <RadioGroup.Label className="label">Veredicto</RadioGroup.Label>
                <div className="-space-y-px rounded">
                    {verdicts.map((verdict, index) => (
                        <RadioGroup.Option
                            key={verdict.id}
                            value={verdict}
                            className={({ checked }) =>
                                clsx(
                                    index === 0
                                        ? 'rounded-tl-md rounded-tr-md'
                                        : '',
                                    index === verdicts.length - 1
                                        ? 'rounded-bl-md rounded-br-md'
                                        : '',
                                    checked
                                        ? 'z-10 border-gray-300 bg-gray-50'
                                        : 'border-gray-200',
                                    'relative flex cursor-pointer border p-4 focus:outline-none'
                                )
                            }
                        >
                            {({ active, checked }) => (
                                <>
                                    <span
                                        className={clsx(
                                            checked
                                                ? 'bg-primary border-transparent'
                                                : 'bg-white border-gray-300',
                                            active
                                                ? 'ring-2 ring-primary ring-offset-2 ring-primary-600'
                                                : '',
                                            'mt-0.5 h-4 w-4 shrink-0 cursor-pointer rounded-full border flex items-center justify-center'
                                        )}
                                        aria-hidden="true"
                                    >
                                        <span className="rounded-full bg-white w-1.5 h-1.5" />
                                    </span>
                                    <span className="ml-3 flex flex-col">
                                        <RadioGroup.Label
                                            as="span"
                                            className={clsx(
                                                checked
                                                    ? 'text-gray-900'
                                                    : 'text-gray-700',
                                                'block text-sm font-medium'
                                            )}
                                        >
                                            {verdict.name}
                                        </RadioGroup.Label>
                                        <RadioGroup.Description
                                            as="span"
                                            className={clsx(
                                                checked
                                                    ? 'text-primary-700'
                                                    : 'text-gray-500',
                                                'block text-sm'
                                            )}
                                        >
                                            {verdict.description}
                                        </RadioGroup.Description>
                                    </span>
                                </>
                            )}
                        </RadioGroup.Option>
                    ))}
                </div>
            </RadioGroup>

            <Button type="submit" className="mt-2 ml-auto" intent="terciary">
                Comentar
            </Button>
        </form>
    )
}

const verdicts = [
    {
        id: 'PENDING',
        name: 'Pendiente',
        description:
            'No dar veredicto aun, solicitar cambios y volver a revisar.',
    },
    {
        id: 'APPROVED',
        name: 'Aprobado',
        description:
            'Aprobar el proyecto presentado, no requiriendo mas cambios',
    },
    {
        id: 'REJECTED',
        name: 'Rechazado',
        description: 'Rechazar el proyecto por algún motivo especificado',
    },
]
