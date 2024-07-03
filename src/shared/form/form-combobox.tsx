import type { ComboboxProps, Option } from '@components/combobox'
import { Combobox } from '@components/combobox'
import { Description, ErrorMessage, Field, Label } from '@components/fieldset'
import type { GetInputPropsReturnType } from '@mantine/form/lib/types'

export function FormCombobox({
  label,
  description,
  error,
  disabled,
  className,
  ...props
}: {
  label: string
  description?: string
  options: Option[]
} & GetInputPropsReturnType &
  ComboboxProps<Option | null>) {
  return (
    <Field disabled={disabled} className={className}>
      <Label>{label}</Label>
      <Description>{description}</Description>
      <Combobox invalid={!!error} {...props} />
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Field>
  )
}
