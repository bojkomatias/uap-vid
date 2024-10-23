import type { Option } from '@components/combobox'
import { Description, ErrorMessage, Field, Label } from '@components/fieldset'
import type { ListboxProps } from '@components/listbox'
import {
  Listbox,
  ListboxDescription,
  ListboxLabel,
  ListboxOption,
} from '@components/listbox'
import type { GetInputPropsReturnType } from '@mantine/form/lib/types'

export function FormListbox({
  label,
  description,
  error,
  disabled,
  options,
  className,
  ...props
}: {
  label: string
  description?: string
  options: Option[]
} & GetInputPropsReturnType &
  ListboxProps<Option>) {
  return (
    <Field disabled={disabled} className={className}>
      <Label>{label}</Label>
      <Description>{description}</Description>
      <Listbox invalid={!!error} className="w-full" {...props}>
        {options.map(({ value, label, description }) => (
          <ListboxOption key={value} value={value}>
            <ListboxLabel>{label}</ListboxLabel>
            {description && (
              <ListboxDescription>{description}</ListboxDescription>
            )}
          </ListboxOption>
        ))}
      </Listbox>
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </Field>
  )
}
