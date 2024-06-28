import { Description, ErrorMessage, Field, Label } from '@components/fieldset'
import { type InputProps } from '@components/input'
import Tiptap from '@elements/tiptap'
import type { GetInputPropsReturnType } from '@mantine/form/lib/types'

export function FormTitapTextarea({
  label,
  description,
  error,
  disabled,
  ...props
}: { label: string; description?: string } & GetInputPropsReturnType &
  InputProps) {
  return (
    <Field disabled={disabled}>
      <Label>{label}</Label>
      <Description>{description}</Description>
      <Tiptap {...props} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Field>
  )
}
