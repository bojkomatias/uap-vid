'use client'

import { notifications } from '@elements/notifications'
import type { Review, Prisma, ProtocolState } from '@prisma/client'
import { ReviewType } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { FormCombobox } from '@shared/form/form-combobox'
import { useForm } from '@mantine/form'
import { FormButton } from '@shared/form/form-button'
import { FieldGroup, Fieldset } from '@components/fieldset'
import {
  assignReviewerToProtocol,
  reassignReviewerToProtocol,
} from '@repositories/review'

interface ReviewAssignSelectProps {
  type: ReviewType
  users: Prisma.UserGetPayload<{
    select: { id: true; name: true; email: true; role: true }
  }>[]
  review: Review | null
  protocolId: string
  protocolState: ProtocolState
}

export const AssignEvaluatorSelector = ({
  type,
  users,
  review,
  protocolId,
  protocolState,
}: ReviewAssignSelectProps) => {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const form = useForm({
    initialValues: { evaluator: review?.reviewerId ?? '' },
  })

  const submitEvaluator = async ({ evaluator }: { evaluator: string }) => {
    if (!review) {
      const newReview = await assignReviewerToProtocol(
        protocolId,
        protocolState,
        evaluator,
        type
      )
      if (newReview) {
        notifications.show({
          title: 'Evaluador asignado',
          message: 'El evaluador ha sido asignado con éxito',
          intent: 'success',
        })
        return startTransition(() => {
          router.refresh()
        })
      }
    }

    if (review) {
      const updatedReview = await reassignReviewerToProtocol(
        review.id,
        protocolId,
        evaluator,
        type
      )
      if (updatedReview) {
        notifications.show({
          title: 'Evaluador asignado',
          message: 'El evaluador ha sido asignado con éxito',
          intent: 'success',
        })
        return startTransition(() => {
          router.refresh()
        })
      }
    }

    return notifications.show({
      title: 'No hemos podido asignar el evaluador',
      message: 'Lo lamentamos, ha ocurrido un error',
      intent: 'error',
    })
  }

  return (
    <form onSubmit={form.onSubmit((values) => submitEvaluator(values))}>
      <Fieldset className="flex items-end gap-1">
        <FormCombobox
          className="grow"
          label={
            type === ReviewType.METHODOLOGICAL ? 'Metodólogo'
            : type === ReviewType.SCIENTIFIC_INTERNAL ?
              'Evaluador interno'
            : type === ReviewType.SCIENTIFIC_EXTERNAL ?
              'Evaluador externo'
            : 'Tercer evaluador'
          }
          description={`El evaluador encargado de llevar a cabo la evaluación ${
            type === ReviewType.METHODOLOGICAL ? 'metodológica'
            : type === ReviewType.SCIENTIFIC_INTERNAL ? 'interna'
            : type === ReviewType.SCIENTIFIC_EXTERNAL ? 'externa'
            : 'resolutiva'
          }`}
          options={users.map((u) => ({
            value: u.id,
            label: u.name,
            description: u.email,
          }))}
          {...form.getInputProps('evaluator')}
        />
        <FormButton isLoading={isPending}>Asignar</FormButton>
      </Fieldset>
    </form>
  )
}
