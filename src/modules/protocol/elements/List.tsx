import { Fragment, PropsWithChildren } from 'react'
import Input from './Input'
import { useProtocolContext } from '../../../utils/createContext'
import Select from './Select'
import { Button } from '../../elements/Button'
import { Plus, Trash } from 'tabler-icons-react'

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
        prefix?: JSX.Element
        type?: 'text' | 'number'
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
                    ) : (
                        <Input
                            path={path + `.${index}.` + h.x}
                            label={h.label}
                            prefix={h.prefix}
                            type={h.type}
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
            <div className="px-4 pb-2 pt-6 space-y-3 border rounded-xl">
                {fields.length === 0 ? (
                    <div className="text-primary label text-center">
                        La lista esta vacía ...
                    </div>
                ) : null}
                {fields}
                <Button
                    onClick={() =>
                        form.insertListItem(path, insertedItemFormat)
                    }
                    intent="secondary"
                    className="mx-auto max-w-xs w-full"
                >
                    <p> Añadir otra fila </p>
                    <Plus className="h-5" />
                </Button>
            </div>
        </div>
    )
}
