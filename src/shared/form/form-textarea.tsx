import { Description, ErrorMessage, Field, Label } from '@components/fieldset'
import type { TextareaProps } from '@components/textarea'
import { Textarea } from '@components/textarea'

import type { GetInputPropsReturnType } from '@mantine/form/lib/types'

export function FormTextarea(
  props: { label: string; description?: string } & GetInputPropsReturnType &
    TextareaProps
) {
  return (
    <Field>
      <Label>{props.label}</Label>
      <Description>{props.description}</Description>
      <Textarea {...props} invalid={!!props.error} />
      {props.error && <ErrorMessage>{props.error}</ErrorMessage>}
    </Field>
  )
}
