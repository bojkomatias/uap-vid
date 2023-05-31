'use client'
import { Button } from '@elements/button'
import { useCallback, useTransition } from 'react'
import { zodResolver } from '@mantine/form'
import { ReviewSchema } from '@utils/zod'
import { useNotifications } from '@mantine/notifications'
import { Check, X } from 'tabler-icons-react'
import { ReviewType, ReviewVerdict } from '@prisma/client'
import type { Review } from '@prisma/client'
import { RadioGroup } from '@headlessui/react'
import clsx from 'clsx'
import ReviewVerdictsDictionary from '@utils/dictionaries/ReviewVerdictsDictionary'
import ItemContainer from '@review/elements/review-container'
import ReviewQuestion from './review-question'
import { ReviewProvider, useReview } from '@utils/reviewContext'
import { useRouter } from 'next/navigation'
import { emailer, useCases } from '@utils/emailer'

export default function ReviewForm({ review }: { review: Review }) {
    const form = useReview({
        initialValues: review,
        validate: zodResolver(ReviewSchema),
        validateInputOnChange: true,
    })
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const notifications = useNotifications()

    const addReview = useCallback(
        async (
            review: Review,
            notifcationTitle = 'Revisión publicada',
            notificationText = 'La revisión fue correctamente publicada.'
        ) => {
            const res = await fetch(`/api/review/${review.id}`, {
                method: 'PUT',
                body: JSON.stringify(review),
            })

            if (res.status == 200) {
                notifications.showNotification({
                    title: notifcationTitle,
                    message: notificationText,
                    color: 'teal',
                    icon: <Check />,
                    radius: 0,
                    style: {
                        marginBottom: '.8rem',
                    },
                })
                emailer(useCases.onReview, review.protocolId)
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
            startTransition(() => router.refresh())
        },
        [notifications, router]
    )

    return (
        <ItemContainer title="Realizar revisión">
            <ReviewProvider form={form}>
                <form
                    onSubmit={(e) => {
                        e.preventDefault()
                        addReview(form.values)
                    }}
                >
                    <div className="max-h-[54svh] space-y-3 divide-y overflow-y-auto border-y bg-white px-2 pb-3">
                        {form.values.questions.map((q, index) => (
                            <ReviewQuestion
                                key={q.id}
                                index={index}
                                id={q.id}
                            />
                        ))}
                    </div>
                    <RadioGroup
                        {...form.getInputProps('verdict')}
                        className={'mx-2'}
                    >
                        <RadioGroup.Label className="label">
                            Veredicto
                        </RadioGroup.Label>
                        <div className="-space-y-px bg-white">
                            <RadioGroup.Option
                                value={ReviewVerdict.APPROVED}
                                className={({ checked }) =>
                                    clsx(
                                        checked
                                            ? 'z-10 border-success-600/30 bg-success-600/5'
                                            : 'border-gray-200',
                                        'relative flex cursor-pointer items-baseline rounded-t border px-5 py-2.5 focus:outline-none'
                                    )
                                }
                            >
                                {({ active, checked }) => (
                                    <>
                                        <span
                                            className={clsx(
                                                checked
                                                    ? 'border-transparent bg-success-600'
                                                    : 'border-gray-300 bg-white',
                                                active
                                                    ? 'ring-2 ring-success-600 ring-offset-1'
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
                                                {
                                                    ReviewVerdictsDictionary[
                                                        ReviewVerdict.APPROVED
                                                    ]
                                                }
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
                                                Hacer devolución del proyecto
                                                como válido y apto para
                                                continuar el proceso.
                                            </RadioGroup.Description>
                                        </span>
                                    </>
                                )}
                            </RadioGroup.Option>
                            <RadioGroup.Option
                                value={ReviewVerdict.APPROVED_WITH_CHANGES}
                                className={({ checked }) =>
                                    clsx(
                                        {
                                            'rounded-b':
                                                review.type ===
                                                ReviewType.METHODOLOGICAL,
                                        },
                                        checked
                                            ? 'z-10 border-warning-600/30 bg-warning-600/5'
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
                                                    ? 'border-transparent bg-warning-600'
                                                    : 'border-gray-300 bg-white',
                                                active
                                                    ? 'ring-2 ring-warning-600 ring-offset-1'
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
                                                {
                                                    ReviewVerdictsDictionary[
                                                        ReviewVerdict
                                                            .APPROVED_WITH_CHANGES
                                                    ]
                                                }
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
                                                Enviar correcciones, si los
                                                cambios son abordados
                                                correctamente, se da como
                                                aprobado.
                                            </RadioGroup.Description>
                                        </span>
                                    </>
                                )}
                            </RadioGroup.Option>
                            <RadioGroup.Option
                                value={ReviewVerdict.REJECTED}
                                className={({ checked }) =>
                                    clsx(
                                        {
                                            hidden:
                                                review.type ===
                                                ReviewType.METHODOLOGICAL,
                                        },
                                        checked
                                            ? 'z-10 border-error-600/30 bg-error-600/5'
                                            : 'border-gray-200',
                                        'relative flex cursor-pointer items-baseline rounded-b border px-5 py-2.5 focus:outline-none'
                                    )
                                }
                            >
                                {({ active, checked }) => (
                                    <>
                                        <span
                                            className={clsx(
                                                checked
                                                    ? 'border-transparent bg-error-600'
                                                    : 'border-gray-300 bg-white',
                                                active
                                                    ? 'ring-2 ring-error-600 ring-offset-1'
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
                                                {
                                                    ReviewVerdictsDictionary[
                                                        ReviewVerdict.REJECTED
                                                    ]
                                                }
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
                                                Marcar protocolo de
                                                investigación como rechazado.
                                            </RadioGroup.Description>
                                        </span>
                                    </>
                                )}
                            </RadioGroup.Option>
                        </div>
                    </RadioGroup>
                    <div className="ml-auto mr-2 mt-2 flex w-fit gap-2">
                        <Button
                            type="button"
                            intent="tertiary"
                            loading={isPending}
                            className={
                                review.verdict !== ReviewVerdict.NOT_REVIEWED
                                    ? 'hidden'
                                    : ''
                            }
                            onClick={() =>
                                addReview(
                                    {
                                        ...form.values,
                                        verdict: 'NOT_REVIEWED',
                                    },
                                    'Revisión guardada',
                                    'La revision fue guardada como borrador, sin veredicto. No podrá ser vista por nadie más que usted.'
                                )
                            }
                        >
                            Guardar
                        </Button>
                        <Button
                            type="submit"
                            loading={isPending}
                            intent="secondary"
                            disabled={
                                form.values.verdict ===
                                ReviewVerdict.NOT_REVIEWED
                            }
                        >
                            Enviar
                        </Button>
                    </div>
                </form>
            </ReviewProvider>
        </ItemContainer>
    )
}
