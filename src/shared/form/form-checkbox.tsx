import type { CheckboxProps } from '@components/checkbox'
import { Checkbox, CheckboxField } from '@components/checkbox'
import { Description, Label } from '@components/fieldset'
import type { GetInputPropsReturnType } from '@mantine/form/lib/types'

export function FormCheckbox(
  props: {
    label: string
    description?: string
    icon?: () => JSX.Element
  } & GetInputPropsReturnType &
    CheckboxProps
) {
  return (
    <CheckboxField>
      <Label>{props.label}</Label>
      <Description>{props.description}</Description>
      <Checkbox {...props} />
    </CheckboxField>
  )
}
