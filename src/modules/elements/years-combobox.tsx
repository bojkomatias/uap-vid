import { Fragment, useEffect, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { Check, ChevronDown } from 'tabler-icons-react'
import { useUpdateQuery } from '@utils/query-helper/updateQuery'

function getYears() {
  const fromYear = 2010 // Arbitrary number
  const maxYear = new Date().getFullYear() + 1
  let currYear = fromYear
  const years = []
  do {
    years.push(currYear)
    currYear++
  } while (currYear <= maxYear)
  return years.map((y) => y.toString()).reverse()
}
const years = getYears()

export function BudgetYearCombobox() {
  const [selected, setSelected] = useState(null)

  const [query, setQuery] = useState('')
  const update = useUpdateQuery()

  useEffect(() => {
    selected &&
      update({
        filter: 'year',
        values: selected,
      })
  }, [selected, update])

  const filteredYears =
    query === '' ? years : (
      years.filter((year) =>
        year
          .replace(/\s+/g, '')
          .includes(query.toLowerCase().replace(/\s+/g, ''))
      )
    )

  return (
    <div className="relative w-fit">
      <Combobox value={selected} onChange={setSelected}>
        <div className="relative">
          <Combobox.Input
            className="input"
            displayValue={(year): string =>
              selected ? (year as string) : 'Filtrar por año'
            }
            onChange={(event) => {
              setQuery(event.target.value)
            }}
          />

          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronDown className="h-4 w-4 text-gray-400" aria-hidden="true" />
          </Combobox.Button>

          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
            afterLeave={() => setQuery('')}
          >
            <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {filteredYears.length === 0 && query !== '' ?
                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                  No se encontraron resultados.
                </div>
              : filteredYears.map((year) => (
                  <Combobox.Option
                    key={year}
                    className={({ active }) =>
                      `relative cursor-default select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-gray-100 text-primary' : 'text-gray-900'
                      }`
                    }
                    value={year}
                  >
                    {({ selected, active }) => (
                      <>
                        <span
                          className={`block truncate ${
                            selected ? 'font-medium' : 'font-normal'
                          }`}
                        >
                          {year}
                        </span>
                        {selected ?
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? 'text-primary' : 'text-teal-600'
                            }`}
                          >
                            <Check className="h-4 w-4" aria-hidden="true" />
                          </span>
                        : null}
                      </>
                    )}
                  </Combobox.Option>
                ))
              }
            </Combobox.Options>
          </Transition>
        </div>
      </Combobox>
    </div>
  )
}
