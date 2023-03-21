import { Fragment, PropsWithChildren } from 'react'
import Input from './Input'

import Select from './Select'

import { Plus, Trash } from 'tabler-icons-react'
import CurrencyInput from './CurrencyInput'
import { useProtocolContext } from '@utils/createContext'
import { Button } from '@elements/Button'
import NumberInput from './NumberInput'

export default function List({
    path,
    label,
    headers,
    insertedItemFormat,
    toMap,
}: PropsWithChildren<{
    path: string
    label: string
    headers: {
        x: string
        label: string
        options?: string[]
        class?: string
        currency?: boolean
        number?: boolean
    }[]
    insertedItemFormat: any
    toMap: any
}>) {
    const form = useProtocolContext()

    const fields = toMap.map((_: any, index: number) => (
        <div
            key={index}
            className="flex w-full items-start justify-around gap-2"
        >
            {headers.map((h: any, i: number) => (
                <div className={` ${h.class}`} key={i}>
                    {h.options ? (
                        <Select
                            options={h.options}
                            path={path + `.${index}.` + h.x}
                            label={h.label}
                        />
                    ) : h.currency ? (
                        <CurrencyInput
                            path={path + `.${index}.` + h.x}
                            label={h.label}
                        />
                    ) : h.number ? (
                        <NumberInput
                            path={path + `.${index}.` + h.x}
                            label={h.label}
                        />
                    ) : (
                        <Input
                            path={path + `.${index}.` + h.x}
                            label={h.label}
                        />
                    )}
                </div>
            ))}

            <Trash
                onClick={() => form.removeListItem(path, index)}
                className={`mt-[2.2rem] h-5 flex-shrink cursor-pointer self-start text-primary hover:text-base-400 active:scale-[0.90] ${
                    index == 0 ? 'pointer-events-none invisible' : ''
                }`}
            />
        </div>
    ))

    return (
        <div>
            <div className="label text-center">{label}</div>
            <div className="space-y-3 rounded-xl border px-4 pb-2 pt-6">
                {fields.length === 0 ? (
                    <div className="label text-center text-primary">
                        La lista esta vacía ...
                    </div>
                ) : null}
                {fields}
                <Button
                    onClick={() =>
                        form.insertListItem(path, insertedItemFormat)
                    }
                    intent="secondary"
                    className="mx-auto w-full max-w-xs"
                >
                    <p> Añadir otra fila </p>
                    <Plus className="h-5" />
                </Button>
            </div>
        </div>
    )
}
