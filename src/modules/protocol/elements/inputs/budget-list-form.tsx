import Input from './input'
import Select from './select'
import { Plus, Trash } from 'tabler-icons-react'
import CurrencyInput from './currency-input'
import { useProtocolContext } from '@utils/createContext'
import { Button } from '@elements/button'
import { currencyFormatter } from '@utils/formatters'

type LeafItemProps = { [key: string]: string | string[] | number }

const preprocess = (array: LeafItemProps[], key: string) => {
    const uniqueKeys = array
        .map((e) => e[key])
        .filter((value, i, a) => a.indexOf(value) === i)

    return uniqueKeys.map((k) => {
        return {
            key: k,
            array: array
                .filter((item) => item[key] === k)
                .flatMap((e) => e.data),
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
        <div>
            <div className="label text-center">gastos</div>
            <div className="space-y-3 rounded-xl border px-4 pb-2 pt-6">
                {arraysOfData.map(({ key, array }, i) => (
                    <>
                        <label className="label text-sm text-gray-800">
                            {key}
                        </label>

                        {array.map((_, index) => (
                            <div
                                key={i + index}
                                id={`row-${i}.data.${index}`}
                                className="flex w-full items-start justify-around gap-2"
                            >
                                <div className="flex-grow">
                                    <Input
                                        path={`sections.budget.expenses.${i}.data.${index}.detail`}
                                        label={'Detalle'}
                                    />
                                </div>
                                <CurrencyInput
                                    path={`sections.budget.expenses.${i}.data.${index}.amount`}
                                    label={'Monto'}
                                />
                                <Select
                                    path={`sections.budget.expenses.${i}.data.${index}.year`}
                                    label={'Año'}
                                    options={years(
                                        form.values.sections.duration.duration
                                    )}
                                />

                                <Trash
                                    onClick={() => {
                                        form.removeListItem(
                                            `sections.budget.expenses.${i}.data`,
                                            index
                                        )
                                    }}
                                    className={`mt-[2.2rem] h-5 flex-shrink cursor-pointer self-start text-primary hover:text-gray-400 active:scale-[0.90]`}
                                />
                            </div>
                        ))}
                        <Button
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
                            intent="outline"
                            className="mx-auto w-full max-w-xs"
                        >
                            <p> Añadir otra fila </p>
                            <Plus className="h-4 text-gray-500" />
                        </Button>
                    </>
                ))}
                <div className="ml-auto mr-4 flex w-fit gap-2 py-4 text-xl">
                    <p className="text-gray-400">Total: </p> $
                    {currencyFormatter.format(
                        form.values.sections.budget.expenses.reduce(
                            (acc, val) => {
                                return (
                                    acc +
                                    val.data.reduce((prev, curr) => {
                                        if (isNaN(curr.amount)) curr.amount = 0
                                        else curr.amount
                                        return prev + curr.amount
                                    }, 0)
                                )
                            },
                            0
                        )
                    )}
                </div>
            </div>
        </div>
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
