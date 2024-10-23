import { Description, ErrorMessage, Field, Label } from '@components/fieldset'
import { Switch, type SwitchProps } from '@components/switch'

import type { GetInputPropsReturnType } from '@mantine/form/lib/types'

export function FormSwitch(
  props: {
    label: string
    description?: string
    className?: string
  } & GetInputPropsReturnType &
    SwitchProps
) {
  return (
    <Field className={props.className}>
      <Label>{props.label}</Label>
      <Description>{props.description}</Description>
      <Switch {...props} />
      {props.error && <ErrorMessage>{props.error}</ErrorMessage>}
    </Field>
  )
}
