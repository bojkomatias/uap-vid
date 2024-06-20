import { Description, ErrorMessage, Field, Label } from '@components/fieldset'
import { type InputProps } from '@components/input'
import Tiptap from '@elements/tiptap'
import type { GetInputPropsReturnType } from '@mantine/form/lib/types'

export function FormTitapTextarea(
  props: { label: string; description?: string } & GetInputPropsReturnType &
    InputProps
) {
  return (
    <Field>
      <Label>{props.label}</Label>
      <Description>{props.description}</Description>
      <Tiptap {...props} />
      {props.error && <ErrorMessage>{props.error}</ErrorMessage>}
    </Field>
  )
}
