import { Description, ErrorMessage, Field, Label } from '@components/fieldset'
import { Input, type InputProps } from '@components/input'
import { Listbox, ListboxLabel, ListboxOption } from '@components/listbox'
import type { GetInputPropsReturnType } from '@mantine/form/lib/types'

type Option = { value: string; label: string }

export function FormListbox(
  props: {
    label: string
    description?: string
    options: Option[]
  } & GetInputPropsReturnType
) {
  return (
    <Field>
      <Label>{props.label}</Label>
      <Description>{props.description}</Description>
      <Listbox
        invalid={!!props.error}
        value={props.value}
        onChange={props.onChange}
      >
        {props.options.map(({ value, label }) => (
          <ListboxOption key={value} value={value}>
            <ListboxLabel>{label}</ListboxLabel>
          </ListboxOption>
        ))}
      </Listbox>
      {props.error && <ErrorMessage>{props.error}</ErrorMessage>}
    </Field>
  )
}
