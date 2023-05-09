'use client'
import { Button } from '@elements/button'
import { useForm } from '@mantine/form'
import { useCallback, useState } from 'react'
import { zodResolver } from '@mantine/form'
import { ReviewSchema } from '@utils/zod'
import { useNotifications } from '@mantine/notifications'
import { Check, X } from 'tabler-icons-react'
import dynamic from 'next/dynamic'
import type { Review, User } from '@prisma/client'
import { ReviewType } from '@prisma/client'
import { RadioGroup } from '@headlessui/react'
import clsx from 'clsx'
import ReviewVerdictsDictionary from '@utils/dictionaries/ReviewVerdictsDictionary'
import ItemContainer from '@review/elements/review-container'
import ReviewItem from '@review/elements/review-item'
import { SegmentedControl } from '@mantine/core'
const Tiptap = dynamic(() => import('@elements/tiptap'))

export default function ReviewForm({
    review,
}: {
    review: Review & { reviewer: User }
}) {
    const form = useForm<Review>({
        initialValues: review,
        validate: zodResolver(ReviewSchema),
        validateInputOnChange: true,
    })
    const [editing, setEditing] = useState('0')
    const notifications = useNotifications()

    const addReview = useCallback(
        async (review: Review) => {
            const res = await fetch(`/api/review/${review.id}`, {
                method: 'PUT',
                body: JSON.stringify(review),
            })

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
        [notifications]
    )

    return (
        <ItemContainer title="Realizar revisión">
            <SegmentedControl
                value={editing}
                onChange={setEditing}
                data={[
                    { label: 'Vista previa', value: '0' },
                    { label: 'Edición', value: '1' },
                ]}
                classNames={{
                    root: 'bg-gray-50 border rounded',
                    label: 'uppercase text-xs px-2 py-1 font-light',
                    indicator: 'bg-primary font-semibold',
                }}
                color="blue"
                fullWidth
                transitionDuration={300}
            />

            <ul className={editing === '0' ? 'block' : 'hidden'}>
                <ReviewItem
                    review={{ ...form.values, reviewer: review.reviewer }}
                    role={review.reviewer.role}
                />
            </ul>

            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    addReview({
                        id: form.values.id,
                        data: form.values.data,
                        verdict: form.values.verdict,
                        createdAt: form.values.createdAt,
                        updatedAt: form.values.updatedAt,
                        type: form.values.type,
                        protocolId: form.values.protocolId,
                        reviewerId: form.values.reviewerId,
                        revised: form.values.revised,
                    })
                }}
                className={editing === '1' ? 'block' : 'hidden'}
            >
                <label className="label">Observación</label>
                <Tiptap {...form.getInputProps('data')} />
                {form.getInputProps('data').error ? (
                    <p className="error">*{form.getInputProps('data').error}</p>
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
