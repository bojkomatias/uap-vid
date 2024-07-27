import { useReviewContext } from '@utils/reviewContext'
import React from 'react'
import type { ReviewQuestion } from '@prisma/client'
import { FormTextarea } from '@shared/form/form-textarea'
import { Strong, Text } from '@components/text'
import { FieldGroup, Label } from '@components/fieldset'
import { Radio, RadioField, RadioGroup } from '@components/radio'

export default function ReviewQuestion({
  id,
  index,
  questions,
}: {
  id: string
  index: number
  questions: ReviewQuestion[]
}) {
  const form = useReviewContext()
  return (
    <FieldGroup>
      <RadioGroup {...form.getInputProps('questions.' + index + '.approved')}>
        <Label className="flex">
          <Strong className="pr-0.5 text-sm/6">{index + 1}) </Strong>
          <Text className="grow">
            {questions.find((question) => question.id == id)?.question}
          </Text>
        </Label>
        <RadioField>
          <Radio value={true} color="teal" />
          <Label>Correcto</Label>
        </RadioField>
        <RadioField>
          <Radio value={false} color="red" />
          <Label>Incompleto / Incorrecto</Label>
        </RadioField>
      </RadioGroup>
      {form.getInputProps('questions.' + index + '.approved').value ? null : (
        <FormTextarea
          label="Correcion o comentario"
          description="Describa su comentario o correcion a realizar"
          {...form.getInputProps('questions.' + index + '.comment')}
        />
      )}
    </FieldGroup>
  )
}
