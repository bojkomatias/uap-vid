import { Fragment, useEffect, useState } from 'react'
import { Combobox, Transition } from '@headlessui/react'
import { Check, ChevronDown } from 'tabler-icons-react'
import { useUpdateQuery } from '@utils/query-helper/updateQuery'

/** Arbitrary number. I select the current year and the past 20 years from there. */
const getYears = () => {
    const yearsArray = []
    const currentYear = new Date().getFullYear()
    for (let i = 0; i < 21; i++) {
        yearsArray.push((currentYear - i).toString())
    }

    return yearsArray
}
const years = getYears()

export default function Example() {
    const [selected, setSelected] = useState('')

    const [query, setQuery] = useState('')
    const update = useUpdateQuery()

    useEffect(() => {
        selected &&
            update({
                filter: 'year',
                values: selected,
            })
    }, [selected, update])

    const filteredPeople =
        query === ''
            ? years
            : years.filter((year) =>
                  year
                      .replace(/\s+/g, '')
                      .includes(query.toLowerCase().replace(/\s+/g, ''))
              )

    return (
        <div className="relative mt-3 w-fit">
            <Combobox value={selected} onChange={setSelected}>
                <div className="relative mt-1">
                    <div className="focus-visible:ring-offset-teal-300 relative w-full cursor-default overflow-hidden rounded-lg border bg-white text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 sm:text-sm">
                        <Combobox.Input
                            className="w-full border-none py-2 pl-3 pr-10 text-sm leading-5 text-gray-900 focus:ring-0"
                            displayValue={(year): string =>
                                selected ? (year as string) : 'Filtrar por año'
                            }
                            onChange={(event) => {
                                setQuery(event.target.value)
                            }}
                        />

                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <ChevronDown
                                className="h-5 w-5 text-gray-400"
                                aria-hidden="true"
                            />
                        </Combobox.Button>
                    </div>
                    <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => setQuery('')}
                    >
                        <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                            {filteredPeople.length === 0 && query !== '' ? (
                                <div className="relative cursor-default select-none px-4 py-2 text-gray-700">
                                    No se encontraron resultados.
                                </div>
                            ) : (
                                filteredPeople.map((year) => (
                                    <Combobox.Option
                                        key={year}
                                        className={({ active }) =>
                                            `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                                active
                                                    ? 'bg-gray-100 text-primary'
                                                    : 'text-gray-900'
                                            }`
                                        }
                                        value={year}
                                    >
                                        {({ selected, active }) => (
                                            <>
                                                <span
                                                    className={`block truncate ${
                                                        selected
                                                            ? 'font-medium'
                                                            : 'font-normal'
                                                    }`}
                                                >
                                                    {year}
                                                </span>
                                                {selected ? (
                                                    <span
                                                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                                            active
                                                                ? 'text-primary'
                                                                : 'text-teal-600'
                                                        }`}
                                                    >
                                                        <Check
                                                            className="h-5 w-5"
                                                            aria-hidden="true"
                                                        />
                                                    </span>
                                                ) : null}
                                            </>
                                        )}
                                    </Combobox.Option>
                                ))
                            )}
                        </Combobox.Options>
                    </Transition>
                </div>
            </Combobox>
        </div>
    )
}
