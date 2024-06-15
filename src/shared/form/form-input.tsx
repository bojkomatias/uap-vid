import { Description, ErrorMessage, Field, Label } from '@components/fieldset'
import { Input, type InputProps } from '@components/input'

import type { GetInputPropsReturnType } from '@mantine/form/lib/types'

export function FormInput(
  props: { label: string; description?: string } & GetInputPropsReturnType &
    InputProps
) {
  return (
    <Field>
      <Label>{props.label}</Label>
      <Description>{props.description}</Description>
      <Input {...props} invalid={!!props.error} />
      <ErrorMessage>{props.error && props.error}</ErrorMessage>
    </Field>
  )
}
