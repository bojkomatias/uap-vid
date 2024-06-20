import { Description, ErrorMessage, Field, Label } from '@components/fieldset'
import { Input, InputGroup, type InputProps } from '@components/input'
import type { GetInputPropsReturnType } from '@mantine/form/lib/types'

export function FormInput(
  props: {
    label: string
    description?: string
    icon?: () => JSX.Element
  } & GetInputPropsReturnType &
    InputProps
) {
  return (
    <Field>
      <Label>{props.label}</Label>
      <Description>{props.description}</Description>
      <InputGroup>
        {props.icon && <props.icon data-slot="icon" />}
        <Input {...props} invalid={!!props.error} />
      </InputGroup>
      {props.error && <ErrorMessage>{props.error}</ErrorMessage>}
    </Field>
  )
}
