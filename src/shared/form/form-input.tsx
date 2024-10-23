import { Description, ErrorMessage, Field, Label } from '@components/fieldset'
import { Input, InputGroup, type InputProps } from '@components/input'
import type { GetInputPropsReturnType } from '@mantine/form/lib/types'
import type { Icon } from 'tabler-icons-react'

export function FormInput({
  label,
  description,
  error,
  disabled,
  className,
  ...props
}: {
  label?: string
  description?: string
  icon?: Icon
} & GetInputPropsReturnType &
  InputProps) {
  return (
    <Field disabled={disabled} className={className}>
      {label && <Label>{label}</Label>}
      <Description>{description}</Description>
      <InputGroup>
        {props.icon && <props.icon data-slot="icon" />}
        <Input {...props} invalid={!!error} />
      </InputGroup>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Field>
  )
}
