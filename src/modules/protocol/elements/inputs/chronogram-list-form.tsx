import Input from './protocol-input'
import { Plus, Trash } from 'tabler-icons-react'
import { useProtocolContext } from '@utils/createContext'
import { Button } from '@elements/button'
import { cx } from '@utils/cx'

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
    <div>
      <div className="label text-center">cronograma de tareas</div>
      <div className="space-y-3 rounded-xl border px-4 pb-2 pt-6">
        {arraysOfData.map(({ key, array }, i) => (
          <>
            <label className="label text-sm text-gray-800">{key}</label>

            {array.map((_, index) => (
              <div
                key={`${i}.data` + index}
                id={`row-${i}.data.${index}`}
                className="flex w-full items-start justify-around gap-2"
              >
                <div className="flex-grow">
                  <Input
                    path={`sections.duration.chronogram.${i}.data.${index}.task`}
                    label={'Detalle'}
                  />
                </div>

                <Trash
                  onClick={() => {
                    form.removeListItem(
                      `sections.duration.chronogram.${i}.data`,
                      index
                    )
                  }}
                  className={cx(
                    'mt-[2.2rem] h-4 flex-shrink cursor-pointer self-start text-primary hover:text-gray-400 active:scale-[0.90]',
                    index === 0 && 'hidden'
                  )}
                />
              </div>
            ))}
            <Button
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
              intent="outline"
              className="mx-auto w-full max-w-xs"
            >
              <p> Añadir otra fila </p>
              <Plus className="h-4 text-gray-500" />
            </Button>
          </>
        ))}
      </div>
    </div>
  )
}
