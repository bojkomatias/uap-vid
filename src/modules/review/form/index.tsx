'use client'
import { Button } from '@elements/Button'
import { useForm } from '@mantine/form'
import { useCallback } from 'react'
import { zodResolver } from '@mantine/form'
import { ReviewSchema } from '@utils/zod'
import { useNotifications } from '@mantine/notifications'
import { Check, X } from 'tabler-icons-react'
import { useRouter } from 'next/navigation'
import dynamic from 'next/dynamic'
import { Review, ReviewVerdict } from '@prisma/client'
import { RadioGroup } from '@headlessui/react'
import clsx from 'clsx'
import ReviewVerdictsDictionary from '@utils/dictionaries/ReviewVerdictsDictionary'
import ItemContainer from '@review/ItemContainer'
const Tiptap = dynamic(() => import('@elements/TipTap'))

export default function ReviewForm({ review }: { review: Review }) {
    const form = useForm<Review>({
        initialValues: review,
        validate: zodResolver(ReviewSchema),
        validateInputOnChange: true,
    })
    const notifications = useNotifications()

    const addReview = useCallback(
        async (data: string, verdict: ReviewVerdict) => {
            const res = await fetch(`/api/review/${review.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    data,
                    verdict,
                }),
            })
            console.log(res)

            if (res.status == 200) {
                notifications.showNotification({
                    title: 'Revisión publicada',
                    message: 'Tu revisión fue correctamente publicada.',
                    color: 'teal',
                    icon: <Check />,
                    radius: 0,
                    style: {
                        marginBottom: '.8rem',
                    },
                })
            } else {
                notifications.showNotification({
                    title: 'Ocurrió un error',
                    message: 'Hubo un problema al publicar tu revisión.',
                    color: 'red',
                    icon: <X />,
                    radius: 0,
                    style: {
                        marginBottom: '.8rem',
                    },
                })
            }
        },
        []
    )
    return (
        <ItemContainer title="Realizar revisión">
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    addReview(form.values.data, form.values.verdict)
                }}
            >
                <label className="label">Observación</label>
                <Tiptap {...form.getInputProps('data')} />
                {form.getInputProps('data').error ? (
                    <p className=" pl-3 pt-1 text-xs text-gray-600 saturate-[80%]">
                        *{form.getInputProps('data').error}
                    </p>
                ) : null}

                <RadioGroup
                    {...form.getInputProps('verdict')}
                    defaultValue="PENDING"
                >
                    <RadioGroup.Label className="label">
                        Veredicto
                    </RadioGroup.Label>
                    <div className="-space-y-px bg-white">
                        {Object.entries(ReviewVerdictsDictionary).map(
                            ([id, name], index) => (
                                <RadioGroup.Option
                                    key={id}
                                    value={id}
                                    className={({ checked }) =>
                                        clsx(
                                            index === 0
                                                ? 'rounded-tl rounded-tr'
                                                : '',
                                            index ===
                                                Object.keys(
                                                    ReviewVerdictsDictionary
                                                ).length -
                                                    1
                                                ? 'rounded-bl rounded-br'
                                                : '',
                                            checked
                                                ? 'z-10 border-gray-300 bg-primary/5'
                                                : 'border-gray-200',
                                            'relative flex cursor-pointer items-baseline border px-5 py-2.5 focus:outline-none'
                                        )
                                    }
                                >
                                    {({ active, checked }) => (
                                        <>
                                            <span
                                                className={clsx(
                                                    checked
                                                        ? 'border-transparent bg-primary'
                                                        : 'border-gray-300 bg-white',
                                                    active
                                                        ? 'ring-2 ring-primary ring-offset-1'
                                                        : '',
                                                    'flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-full border'
                                                )}
                                                aria-hidden="true"
                                            >
                                                <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                            </span>
                                            <span className="ml-3 flex flex-col">
                                                <RadioGroup.Label
                                                    as="span"
                                                    className={clsx(
                                                        checked
                                                            ? 'font-medium text-gray-900'
                                                            : 'font-regular text-gray-700',
                                                        'block text-sm'
                                                    )}
                                                >
                                                    {name}
                                                </RadioGroup.Label>
                                                <RadioGroup.Description
                                                    as="span"
                                                    className={clsx(
                                                        checked
                                                            ? 'text-gray-700'
                                                            : 'text-gray-500',
                                                        'block text-xs'
                                                    )}
                                                >
                                                    {id === 'PENDING'
                                                        ? 'Enviar correcciones sin veredicto, esperar cambios para re-evaluar.'
                                                        : id === 'APPROVED'
                                                        ? 'Hacer devolución del proyecto como válido y apto para continuar el proceso.'
                                                        : 'Marcar proyecto como rechazado.'}
                                                </RadioGroup.Description>
                                            </span>
                                        </>
                                    )}
                                </RadioGroup.Option>
                            )
                        )}
                    </div>
                </RadioGroup>

                <Button
                    type="submit"
                    className="ml-auto mt-2"
                    intent="secondary"
                >
                    Comentar
                </Button>
            </form>
        </ItemContainer>
    )
}
