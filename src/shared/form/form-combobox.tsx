import type { ComboboxProps, Option } from '@components/combobox'
import { Combobox } from '@components/combobox'
import { Description, ErrorMessage, Field, Label } from '@components/fieldset'
import type { GetInputPropsReturnType } from '@mantine/form/lib/types'

export function FormCombobox({
  label,
  description,
  error,
  disabled,
  ...props
}: {
  label: string
  description?: string
  options: Option[]
} & GetInputPropsReturnType &
  ComboboxProps<Option>) {
  return (
    <Field disabled={disabled}>
      <Label>{label}</Label>
      <Description>{description}</Description>
      <Combobox invalid={!!error} {...props} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Field>
  )
}
