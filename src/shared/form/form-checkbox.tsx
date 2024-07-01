import type { CheckboxProps } from '@components/checkbox'
import { Checkbox, CheckboxField } from '@components/checkbox'
import { Description, Label } from '@components/fieldset'
import type { GetInputPropsReturnType } from '@mantine/form/lib/types'

export function FormCheckbox({
  label,
  description,
  disabled,
  ...props
}: {
  label: string
  description?: string
} & GetInputPropsReturnType &
  CheckboxProps) {
  return (
    <CheckboxField disabled={disabled}>
      <Label>{label}</Label>
      <Description>{description}</Description>
      <Checkbox {...props} />
    </CheckboxField>
  )
}
