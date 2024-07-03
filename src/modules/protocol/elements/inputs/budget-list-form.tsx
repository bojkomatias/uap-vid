import { CurrencyDollar, Plus, Trash } from 'tabler-icons-react'
import { useProtocolContext } from '@utils/createContext'
import { currencyFormatter } from '@utils/formatters'
import {
  Description,
  Field,
  Fieldset,
  Label,
  Legend,
} from '@components/fieldset'
import { Strong, Text } from '@components/text'
import { Button } from '@components/button'
import { Fragment } from 'react'
import { FormInput } from '@shared/form/form-input'
import { FormListbox } from '@shared/form/form-listbox'

type LeafItemProps = { [key: string]: string | string[] | number }

const preprocess = (array: LeafItemProps[], key: string) => {
  const uniqueKeys = array
    .map((e) => e[key])
    .filter((value, i, a) => a.indexOf(value) === i)

  return uniqueKeys.map((k) => {
    return {
      key: k,
      array: array.filter((item) => item[key] === k).flatMap((e) => e.data),
    }
  })
}

export function BudgetList() {
  const form = useProtocolContext()
  const preprocessKey = 'type'
  const newLeafItemValue = {
    detail: '',
    amount: 0,
    year: '',
  }

  const data: LeafItemProps[] = form.getInputProps(
    'sections.budget.expenses'
  ).value

  const arraysOfData = preprocess(data, preprocessKey)

  return (
    <Fieldset>
      <Legend>Cuadro de gastos directos</Legend>
      <Text className="mb-2">
        Liste los gastos detallando monto y año donde se necesitaran, deje
        vacías las categorias que no sean necesarias
      </Text>
      {arraysOfData.map(({ key, array }, i) => (
        <>
          <Legend className="mt-4">{key}</Legend>
          <div className=" grid grid-cols-[repeat(21,minmax(0,1fr))] gap-1">
            {form.getInputProps(`sections.budget.expenses.${i}.data`).value
              .length > 0 && (
              <>
                <Field className="col-span-12">
                  <Label>Detalle</Label>
                  <Description>Detalle lo que se solicita</Description>
                </Field>
                <Field className="col-span-5">
                  <Label>Monto</Label>
                  <Description>Coste actual del ítem</Description>
                </Field>
                <Field className="col-span-3">
                  <Label>Año</Label>
                  <Description>Año en el que se usará</Description>
                </Field>
                <span />
              </>
            )}
            {array.map((_, index) => (
              <Fragment key={i + index}>
                <FormInput
                  className="col-span-12"
                  label=""
                  {...form.getInputProps(
                    `sections.budget.expenses.${i}.data.${index}.detail`
                  )}
                />

                <FormInput
                  className="col-span-5"
                  icon={CurrencyDollar}
                  type="number"
                  label=""
                  {...form.getInputProps(
                    `sections.budget.expenses.${i}.data.${index}.amount`
                  )}
                />
                <FormListbox
                  className="col-span-3"
                  label=""
                  options={years(form.values.sections.duration.duration).map(
                    (e) => ({ value: e, label: e })
                  )}
                  {...form.getInputProps(
                    `sections.budget.expenses.${i}.data.${index}.year`
                  )}
                />

                <Button
                  plain
                  className="mt-1 self-start"
                  onClick={() => {
                    form.removeListItem(
                      `sections.budget.expenses.${i}.data`,
                      index
                    )
                  }}
                >
                  <Trash data-slot="icon" />
                </Button>
              </Fragment>
            ))}
          </div>
          <Button
            plain
            onClick={() => {
              form.insertListItem(
                `sections.budget.expenses.${i}.data`,
                newLeafItemValue
              )

              setTimeout(() => {
                document
                  .getElementById(`row-${array.length}`)
                  ?.getElementsByTagName('input')[0]
                  .focus()
              }, 10)
            }}
            className="my-1"
          >
            <Plus data-slot="icon" />
            Añadir {key}
          </Button>
        </>
      ))}
      <Text className="ml-auto mr-4 flex w-fit space-x-1">
        <span>Total:</span>
        <Strong>
          {currencyFormatter.format(
            form.values.sections.budget.expenses.reduce((acc, val) => {
              return (
                acc +
                val.data.reduce((prev, curr) => {
                  if (isNaN(curr.amount)) curr.amount = 0
                  else curr.amount
                  return prev + curr.amount
                }, 0)
              )
            }, 0) ?? 0
          )}
        </Strong>
      </Text>
    </Fieldset>
  )
}

const years = (v: string) => {
  const yearQuantity = Number(v.substring(0, 2)) / 12
  const currentYear = new Date().getFullYear()
  const years: string[] = [String(currentYear)]
  for (let i = 0; i < yearQuantity; i++) {
    years.push(String(currentYear + i + 1))
  }
  return years
}
