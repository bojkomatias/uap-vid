import { TrashIcon, PlusIcon } from '@heroicons/react/outline'
import { useForm, formList } from '@mantine/form'
import { Fragment, PropsWithChildren, useEffect } from 'react'
import { InputType } from '../../config/enums'
import { Input as InputT } from '../../config/types'
import Input from './Input'
import gsap from 'gsap'

export default function Table({
    data,
    updateData,
}: PropsWithChildren<{ data: InputT; updateData: Function }>) {
    const headers = data.options.map((option: any) => option)
    const table = useForm({
        initialValues: {
            data: formList<any>(data.value),
        },
    })

    useEffect(() => {
        updateData({ ...data, value: table.values.data })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [table.values])

    const fields = table.values.data.map((_, index) => (
        <div key={index} className="my-2 flex w-full gap-3 ">
            {headers.map((h: any, i: number) => (
                <Fragment key={i}>
                    {h.type === InputType.select ? (
                        <select
                            className="input"
                            {...table.getListInputProps(
                                'data',
                                index,
                                headers[i].name
                            )}
                        >
                            {h.options.map((option: any, index: number) => (
                                <option key={index} value={option}>
                                    {option}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            type="text"
                            {...table.getListInputProps(
                                'data',
                                index,
                                headers[i].name
                            )}
                            className="input"
                        />
                    )}
                </Fragment>
            ))}

            <TrashIcon
                onClick={() => table.removeListItem('data', index)}
                className="my-auto w-24 flex-grow cursor-pointer items-center text-primary transition-all duration-200 hover:text-base-400 active:scale-[0.90]"
            />
        </div>
    ))

    return (
        <div>
            {fields.length > 0 ? (
                <div className="flex justify-evenly capitalize ">
                    {headers.map((header: any, index: any) => (
                        <span
                            key={index}
                            className="text-md font-extrabold text-primary xl:w-[256px]"
                        >
                            {header.header}
                        </span>
                    ))}
                </div>
            ) : (
                <div className="text-sm font-extrabold text-primary">
                    La lista esta vacia...
                </div>
            )}

            {fields}
            <a
                onClick={() => table.addListItem('data', data.value[0])}
                className="cursor-pointer"
            >
                <div className="group mt-5 flex items-center justify-center gap-2 bg-base-100 py-2 transition-all duration-200 hover:bg-primary">
                    <p className="my-auto text-sm font-extrabold text-primary transition-all duration-200  group-hover:text-white">
                        Añadir otra fila
                    </p>
                    <PlusIcon className="h-5 w-5 cursor-pointer text-primary transition-all duration-200 group-hover:text-white" />
                </div>
            </a>
        </div>
    )
}
