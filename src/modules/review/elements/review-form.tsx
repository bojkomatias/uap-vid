'use client'
import { Button } from '@elements/button'
import { notifications } from '@elements/notifications'
import { RadioGroup } from '@headlessui/react'
import { zodResolver } from '@mantine/form'
import type { Review } from '@prisma/client'
import { ReviewType, ReviewVerdict } from '@prisma/client'
import { cx } from '@utils/cx'
import ReviewVerdictsDictionary from '@utils/dictionaries/ReviewVerdictsDictionary'
import { ReviewProvider, useReview } from '@utils/reviewContext'
import { ReviewSchema } from '@utils/zod'
import { useRouter } from 'next/navigation'
import { useCallback, useTransition } from 'react'
import ReviewQuestion from './review-question'
import { questions as rawQuestions } from 'config/review-questions'
import { updateReview } from '@repositories/review'
import { emailer } from '@utils/emailer'
import { useCases } from '@utils/emailer/use-cases'

export default function ReviewForm({ review }: { review: Review }) {
  const form = useReview({
    initialValues: {
      ...review,
      //This filter passes only the active questions to the form values.
      questions: review.questions.filter((q) => {
        const questionInfo = rawQuestions.find(
          (rQuestion) => rQuestion.id === q.id
        )
        return questionInfo ? questionInfo.active : false
      }),
    },
    validate: zodResolver(ReviewSchema),
    validateInputOnChange: true,
  })
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const addReview = useCallback(
    async (
      review: Review,
      notifcationTitle = 'Revisión publicada',
      notificationText = 'La revisión fue correctamente publicada.'
    ) => {
      const reviewUpdated = await updateReview(review)

      if (reviewUpdated) {
        emailer({
          useCase: useCases.onReview,
          email: reviewUpdated.protocol.researcher.email,
          protocolId: reviewUpdated.protocolId,
        })
        notifications.show({
          title: notifcationTitle,
          message: notificationText,
          intent: 'success',
        })
        return startTransition(() => router.refresh())
      }
      notifications.show({
        title: 'Ocurrió un error',
        message: 'Hubo un problema al publicar tu revisión.',
        intent: 'error',
      })
      return startTransition(() => router.refresh())
    },
    [router]
  )

  return (
    <>
      <h3 className="ml-2 text-lg font-semibold text-gray-900">
        Realizar revisión
      </h3>

      <ReviewProvider form={form}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            addReview({
              ...form.values,

              revised: false,
              updatedAt: new Date(),
            })
          }}
        >
          <div className="space-y-3 divide-y overflow-y-auto border-y bg-white px-2 pb-3">
            {form.values.questions.map((q, index) => (
              <ReviewQuestion key={q.id} index={index} id={q.id} />
            ))}
          </div>
          <RadioGroup {...form.getInputProps('verdict')} className={'mx-2'}>
            <RadioGroup.Label className="label">Veredicto</RadioGroup.Label>
            <div className="-space-y-px bg-white">
              <RadioGroup.Option
                value={ReviewVerdict.APPROVED}
                className={({ checked }) =>
                  cx(
                    'relative flex cursor-pointer items-baseline rounded-t border px-5 py-2.5 focus:outline-none',
                    checked ? 'z-10 border-success-600/30 bg-success-600/5' : ''
                  )
                }
              >
                {({ active, checked }) => (
                  <>
                    <span
                      className={cx(
                        'flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-full border',
                        checked
                          ? 'border-transparent bg-success-600'
                          : ' bg-white',
                        active ? 'ring-2 ring-success-600 ring-offset-1' : ''
                      )}
                      aria-hidden="true"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    </span>
                    <span className="ml-3 flex flex-col">
                      <RadioGroup.Label
                        as="span"
                        className={cx(
                          'block text-sm',
                          checked
                            ? 'font-medium text-gray-900'
                            : 'font-regular text-gray-700'
                        )}
                      >
                        {ReviewVerdictsDictionary[ReviewVerdict.APPROVED]}
                      </RadioGroup.Label>
                      <RadioGroup.Description
                        as="span"
                        className={cx(
                          'block text-xs',
                          checked ? 'text-gray-700' : 'text-gray-500'
                        )}
                      >
                        Hacer devolución del proyecto como válido y apto para
                        continuar el proceso.
                      </RadioGroup.Description>
                    </span>
                  </>
                )}
              </RadioGroup.Option>
              <RadioGroup.Option
                value={ReviewVerdict.APPROVED_WITH_CHANGES}
                className={({ checked }) =>
                  cx(
                    'relative flex cursor-pointer items-baseline border px-5 py-2.5 focus:outline-none',
                    review.type === ReviewType.METHODOLOGICAL && 'rounded-b',
                    checked ? 'z-10 border-warning-600/30 bg-warning-600/5' : ''
                  )
                }
              >
                {({ active, checked }) => (
                  <>
                    <span
                      className={cx(
                        'flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-full border',
                        checked
                          ? 'border-transparent bg-warning-600'
                          : ' bg-white',
                        active ? 'ring-2 ring-warning-600 ring-offset-1' : ''
                      )}
                      aria-hidden="true"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    </span>
                    <span className="ml-3 flex flex-col">
                      <RadioGroup.Label
                        as="span"
                        className={cx(
                          'block text-sm',
                          checked
                            ? 'font-medium text-gray-900'
                            : 'font-regular text-gray-700'
                        )}
                      >
                        {
                          ReviewVerdictsDictionary[
                            ReviewVerdict.APPROVED_WITH_CHANGES
                          ]
                        }
                      </RadioGroup.Label>
                      <RadioGroup.Description
                        as="span"
                        className={cx(
                          'block text-xs',
                          checked ? 'text-gray-700' : 'text-gray-500'
                        )}
                      >
                        Enviar correcciones, si los cambios son abordados
                        correctamente, se da como aprobado.
                      </RadioGroup.Description>
                    </span>
                  </>
                )}
              </RadioGroup.Option>
              <RadioGroup.Option
                value={ReviewVerdict.REJECTED}
                className={({ checked }) =>
                  cx(
                    'relative flex cursor-pointer items-baseline rounded-b border px-5 py-2.5 focus:outline-none',
                    checked ? 'z-10 border-error-600/30 bg-error-600/5' : '',
                    review.type === ReviewType.METHODOLOGICAL && 'hidden'
                  )
                }
              >
                {({ active, checked }) => (
                  <>
                    <span
                      className={cx(
                        'flex h-4 w-4 shrink-0 cursor-pointer items-center justify-center rounded-full border',
                        checked
                          ? 'border-transparent bg-error-600'
                          : ' bg-white',
                        active ? 'ring-2 ring-error-600 ring-offset-1' : ''
                      )}
                      aria-hidden="true"
                    >
                      <span className="h-1.5 w-1.5 rounded-full bg-white" />
                    </span>
                    <span className="ml-3 flex flex-col">
                      <RadioGroup.Label
                        as="span"
                        className={cx(
                          'block text-sm',
                          checked
                            ? 'font-medium text-gray-900'
                            : 'font-regular text-gray-700'
                        )}
                      >
                        {ReviewVerdictsDictionary[ReviewVerdict.REJECTED]}
                      </RadioGroup.Label>
                      <RadioGroup.Description
                        as="span"
                        className={cx(
                          'block text-xs',
                          checked ? 'text-gray-700' : 'text-gray-500'
                        )}
                      >
                        Marcar protocolo de investigación como rechazado.
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
              intent="outline"
              loading={isPending}
              className={
                review.verdict !== ReviewVerdict.NOT_REVIEWED ? 'hidden' : ''
              }
              onClick={() =>
                addReview(
                  {
                    ...form.values,
                    verdict: ReviewVerdict.NOT_REVIEWED,
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
              disabled={form.values.verdict === ReviewVerdict.NOT_REVIEWED}
            >
              Enviar
            </Button>
          </div>
        </form>
      </ReviewProvider>
    </>
  )
}
