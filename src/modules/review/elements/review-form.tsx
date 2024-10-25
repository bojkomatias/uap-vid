'use client'

import { notifications } from '@elements/notifications'
import { zodResolver } from '@mantine/form'
import type { Review, ReviewQuestion as RQuestion } from '@prisma/client'
import { ReviewType, ReviewVerdict } from '@prisma/client'
import {
  ReviewVerdictColorDictionary,
  ReviewVerdictDictionary,
} from '@utils/dictionaries/ReviewVerdictsDictionary'
import { ReviewProvider, useReview } from '@utils/reviewContext'
import { ReviewSchema } from '@utils/zod'
import { useRouter } from 'next/navigation'
import { useCallback, useTransition } from 'react'
import ReviewQuestion from './review-question'
import { updateReview } from '@repositories/review'
import { emailer } from '@utils/emailer'
import { useCases } from '@utils/emailer/use-cases'
import { Heading } from '@components/heading'
import {
  Description,
  Fieldset,
  FormActions,
  Label,
  Legend,
} from '@components/fieldset'
import { Text } from '@components/text'
import { Divider } from '@components/divider'
import { Radio, RadioField, RadioGroup } from '@components/radio'
import { SubmitButton } from '@shared/submit-button'
import { Button } from '@components/button'

export default function ReviewForm({
  review,
  questions,
}: {
  review: Review
  questions: RQuestion[]
}) {
  const form = useReview({
    initialValues: {
      ...review,
      //This filter passes only the active questions to the form values.
      questions: review.questions.filter((q) => {
        const questionInfo = questions.find(
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
    <div id="review-inside-container">
      <div>
        <Heading>Realizar revisión</Heading>
        <Text>
          Responda las preguntas dejando comentarios en las que sea necesario
        </Text>
      </div>
      <Divider />

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
          <Fieldset>
            {form.values.questions.map((q, index) => (
              <ReviewQuestion
                key={q.id}
                questions={questions}
                index={index}
                id={q.id}
              />
            ))}
          </Fieldset>
          <Divider className="mt-6" />
          <Fieldset>
            <Legend>Veredicto de la evaluacion</Legend>
            <Text>
              Indique si el proyecto esta en condiciones de proceder a la
              siguiente etapa, o require modificaciones
            </Text>
            <RadioGroup {...form.getInputProps('verdict')}>
              <RadioField>
                <Radio
                  value={ReviewVerdict.APPROVED}
                  color={ReviewVerdictColorDictionary[ReviewVerdict.APPROVED]}
                />
                <Label>{ReviewVerdictDictionary[ReviewVerdict.APPROVED]}</Label>
                <Description>
                  Hacer devolución del proyecto como válido y apto para
                  continuar el proceso.
                </Description>
              </RadioField>
              <RadioField>
                <Radio
                  value={ReviewVerdict.APPROVED_WITH_CHANGES}
                  color={
                    ReviewVerdictColorDictionary[
                      ReviewVerdict.APPROVED_WITH_CHANGES
                    ]
                  }
                />
                <Label>
                  {ReviewVerdictDictionary[ReviewVerdict.APPROVED_WITH_CHANGES]}
                </Label>
                <Description>
                  Enviar correcciones, si los cambios son abordados
                  correctamente, se da como aprobado.
                </Description>
              </RadioField>
              <RadioField
                className={
                  review.type === ReviewType.METHODOLOGICAL ? 'hidden' : ''
                }
              >
                <Radio
                  value={ReviewVerdict.REJECTED}
                  color={ReviewVerdictColorDictionary[ReviewVerdict.REJECTED]}
                />
                <Label>{ReviewVerdictDictionary[ReviewVerdict.REJECTED]}</Label>
                <Description>
                  Marcar protocolo de investigación como rechazado.
                </Description>
              </RadioField>
            </RadioGroup>
            <FormActions>
              <Button
                plain
                disabled={isPending}
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
              <SubmitButton
                disabled={form.values.verdict === ReviewVerdict.NOT_REVIEWED}
                isLoading={isPending}
              >
                Enviar
              </SubmitButton>
            </FormActions>
          </Fieldset>
        </form>
      </ReviewProvider>
    </div>
  )
}
