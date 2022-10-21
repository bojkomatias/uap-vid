import { TrashIcon, PlusIcon } from '@heroicons/react/outline'

import { Fragment, PropsWithChildren, useEffect } from 'react'
import { InputType } from '../../config/enums'
import { Input as InputT } from '../../config/types'
import Input from './Input'
import gsap from 'gsap'
import { useProtocolContext } from '../../config/createContext'
import Select from './Select'

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
        <div key={index} className="flex w-full gap-3">
            {headers.map((h: any, i: number) => (
                <Fragment key={i}>
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
                </Fragment>
            ))}

            <TrashIcon
                onClick={() => form.removeListItem(path + x, index)}
                className="h-6 flex-grow cursor-pointer self-center text-primary transition-all duration-200 hover:text-base-400 active:scale-[0.90]"
            />
        </div>
    ))

    return (
        <div className="p-4">
            {fields.length > 0 ? (
                <div className=" text-xs font-thin uppercase text-base-600">
                    {label}
                </div>
            ) : (
                <div className="text-sm text-primary">
                    La lista esta vacía...
                </div>
            )}

            {fields}
            <a
                onClick={() =>
                    form.insertListItem(path + x, insertedItemFormat)
                }
                className="cursor-pointer"
            >
                <div className="group mx-4 mt-3 flex items-center justify-center gap-2 bg-base-100 py-2 transition-all duration-200 hover:bg-primary">
                    <p className="my-auto text-sm font-extrabold text-primary transition-all duration-200  group-hover:text-white">
                        Añadir otra fila
                    </p>
                    <PlusIcon className="h-5 w-5 cursor-pointer text-primary transition-all duration-200 group-hover:text-white" />
                </div>
            </a>
        </div>
    )
}
