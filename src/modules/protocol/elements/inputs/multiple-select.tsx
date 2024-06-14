'use client'
import type { PropsWithChildren } from 'react'
import { Combobox } from '@headlessui/react'
import { Check, Selector, X } from 'tabler-icons-react'
import { cx } from '@utils/cx'
import { useProtocolContext } from '@utils/createContext'

export default function MultipleSelect({
  path,
  label,
  options,
}: PropsWithChildren<{
  path: string
  label: string
  options: string[]
}>) {
  const form = useProtocolContext()

  return (
    <div>
      <label className="label">{label}</label>
      <Combobox as="div" {...form.getInputProps(path)} multiple>
        <div className="relative">
          <Combobox.Button className="relative w-full">
            <Combobox.Input
              autoComplete="off"
              className={'input'}
              placeholder={label}
              displayValue={(e: string[]) =>
                form.getInputProps(path).value.length < 2 ?
                  e.join(', ')
                : e.map((x) => x.split('-')[1]).join(' | ')
              }
            />

            <div className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none ">
              <X
                className={cx(
                  'mr-1 h-6 w-6 rounded-full p-1 text-gray-400 transition-all duration-200 hover:scale-110 hover:bg-gray-100 hover:stroke-2 hover:text-gray-700 active:scale-95',
                  form.getInputProps(path).value.length === 0 ? 'hidden' : ''
                )}
                onClick={(e) => {
                  e.stopPropagation()
                  form.setFieldValue(path, [])
                }}
                aria-hidden="true"
              />
              <Selector
                className="h-4 text-gray-600 hover:text-gray-400"
                aria-hidden="true"
              />
            </div>
          </Combobox.Button>
          {form.getInputProps(path).error ?
            <p className="error">*{form.getInputProps(path).error}</p>
          : null}

          <Combobox.Options className="absolute z-20 mt-1.5 max-h-60 w-full overflow-auto rounded border  bg-white py-1 text-base shadow focus:outline-none sm:text-sm">
            {options.map((value: string, index: number) => (
              <Combobox.Option
                key={index}
                value={value}
                className={({ active }) =>
                  cx(
                    'relative cursor-default select-none py-2 pl-8 pr-4',
                    active ? 'bg-gray-100' : 'text-gray-600'
                  )
                }
              >
                {({ active, selected }) => (
                  <>
                    <span
                      className={cx(
                        'block truncate',
                        selected && 'font-semibold text-primary'
                      )}
                    >
                      <span>{value}</span>
                    </span>

                    {selected && (
                      <span
                        className={cx(
                          'absolute inset-y-0 left-0 flex items-center pl-1.5 text-primary',
                          active ? 'text-white' : ''
                        )}
                      >
                        <Check
                          className="ml-1 h-4 w-4 text-gray-500"
                          aria-hidden="true"
                        />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        </div>
      </Combobox>
    </div>
  )
}
