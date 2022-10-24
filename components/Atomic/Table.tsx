import { TrashIcon, PlusIcon } from '@heroicons/react/outline'
import { Fragment, PropsWithChildren } from 'react'
import Input from './Input'
import { useProtocolContext } from '../../config/createContext'
import Select from './Select'
import { Button } from './Button'

export default function Table({
    path,
    x,
    label,
    headers,
    insertedItemFormat,
    toMap,
}: PropsWithChildren<{
    path: string
    x: string
    label: string
    headers: { x: string; label: string; options?: string[] }[]
    insertedItemFormat: any
    toMap: any
}>) {
    const form = useProtocolContext()

    const fields = toMap.map((_: any, index: any) => (
        <div key={index} className="flex w-full items-start justify-around ">
            {headers.map((h: any, i: number) => (
                <div className="flex-grow" key={i}>
                    {h.options ? (
                        <Select
                            options={h.options}
                            path={`${path}${x}.${index}.`}
                            x={h.x}
                            label={h.label}
                        />
                    ) : (
                        <Input
                            path={`${path}${x}.${index}.`}
                            x={h.x}
                            label={h.label}
                        />
                    )}
                </div>
            ))}

            <TrashIcon
                onClick={() => form.removeListItem(path + x, index)}
                className="mr-3 h-6 flex-shrink cursor-pointer self-center text-primary transition-all duration-200 hover:text-base-400 active:scale-[0.90]"
            />
        </div>
    ))

    return (
        <div className="p-2">
            <div className="text-center text-xs font-thin uppercase text-base-600">
                {fields.length > 0 ? (
                    label
                ) : (
                    <div className="flex flex-col gap-2">
                        <div>{label}</div>
                        <span className="mx-auto text-primary transition-all duration-150">
                            La lista esta vacía ...
                        </span>
                    </div>
                )}
            </div>

            {fields}
            <Button
                onClick={() =>
                    form.insertListItem(path + x, insertedItemFormat)
                }
                className="mx-auto my-2 w-1/3 cursor-pointer justify-center gap-2 text-xs"
            >
                <p> Añadir otra fila </p>
                <PlusIcon className="h-5 w-5 cursor-pointer text-primary transition-all duration-200 group-hover:text-white" />
            </Button>
        </div>
    )
}
