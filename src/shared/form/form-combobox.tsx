import type { Option } from '@components/combobox'
import { Combobox } from '@components/combobox'
import { Description, ErrorMessage, Field, Label } from '@components/fieldset'
import type { ListboxProps } from '@components/listbox'
import type { GetInputPropsReturnType } from '@mantine/form/lib/types'

export function FormCombobox(
  props: {
    label: string
    description?: string
    options: Option[]
  } & GetInputPropsReturnType &
    ListboxProps<Option>
) {
  return (
    <Field>
      <Label>{props.label}</Label>
      <Description>{props.description}</Description>
      <Combobox
        invalid={!!props.error}
        value={props.value}
        onChange={(e) => props.onChange(e)}
        options={props.options}
      />
      {props.error && <ErrorMessage>{props.error}</ErrorMessage>}
    </Field>
  )
}
