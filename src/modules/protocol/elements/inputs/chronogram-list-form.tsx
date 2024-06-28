import { Plus, Trash } from 'tabler-icons-react'
import { useProtocolContext } from '@utils/createContext'
import { FormInput } from '@shared/form/form-input'
import {
  Description,
  Field,
  Fieldset,
  Label,
  Legend,
} from '@components/fieldset'
import { Text } from '@components/text'
import { Button } from '@components/button'

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

export function ChronogramList() {
  const form = useProtocolContext()
  const preprocessKey = 'semester'
  const newLeafItemValue = {
    task: '',
  }

  const data: LeafItemProps[] = form.getInputProps(
    'sections.duration.chronogram'
  ).value

  const arraysOfData = preprocess(data, preprocessKey)

  return (
    <Fieldset>
      <Legend>Cronograma de tareas</Legend>
      <Text className="mb-2">
        Cuadro de tareas átomicas por cada semestre de la investigación
      </Text>
      {arraysOfData.map(({ key, array }, i) => (
        <Field key={i}>
          <Label>{key}</Label>
          <Description>Liste las tareas del {key}</Description>
          {array.map((_, index) => (
            <div key={`${i}.data` + index} className="flex gap-0.5">
              <FormInput
                className="grow"
                label=""
                {...form.getInputProps(
                  `sections.duration.chronogram.${i}.data.${index}.task`
                )}
              />

              {index === 0 ?
                <span />
              : <Button plain className="mt-1 self-start">
                  <Trash
                    data-slot="icon"
                    onClick={() =>
                      form.removeListItem(
                        `sections.duration.chronogram.${i}.data`,
                        index
                      )
                    }
                  />
                </Button>
              }
            </div>
          ))}

          <Button
            plain
            onClick={() => {
              form.insertListItem(
                `sections.duration.chronogram.${i}.data`,
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
            Añadir otra tarea
          </Button>
        </Field>
      ))}
    </Fieldset>
  )
}
