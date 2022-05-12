import { TrashIcon, PlusIcon } from '@heroicons/react/outline'
import { useForm, formList } from '@mantine/form'
import { PropsWithChildren } from 'react'
import { Input } from '../../config/types'

export default function Table({ data }: PropsWithChildren<{ data: Input }>) {
    const headers = Object.keys(data.value[0])
    const table = useForm({
        initialValues: {
            data: formList<any>(data.value),
        },
    })
    const fields = table.values.data.map((_, index) => (
        <div key={index} className="my-2 flex w-full gap-3 ">
            {headers.map((_, i) => (
                <input
                    placeholder={headers[i]}
                    key={i}
                    type="text"
                    {...table.getListInputProps('data', index, headers[i])}
                    className="shadowInner focus:border-primary sm:text-md w-full p-3 py-2 pl-3 pr-10  capitalize shadow-inner placeholder:capitalize focus:outline-none  focus:ring-1"
                />
            ))}

            <TrashIcon
                onClick={() => table.removeListItem('data', index)}
                className="text-primary my-auto w-24 flex-grow cursor-pointer items-center transition-all duration-200 hover:text-base-400"
            />
        </div>
    ))

    return (
        <div>
            {fields.length > 0 ? (
                <div className="flex justify-evenly capitalize ">
                    {headers.map((header, index) => (
                        <span
                            key={index}
                            className="text-md text-primary w-[272px] font-extrabold "
                        >
                            {header}
                        </span>
                    ))}
                </div>
            ) : (
                <div className="text-primary text-sm font-extrabold">
                    La lista esta vacia...
                </div>
            )}

            {fields}
            <a
                onClick={() => table.addListItem('data', data.value[0])}
                className="cursor-pointer"
            >
                <div className="hover:bg-primary group mt-5 flex items-center justify-center gap-2 bg-base-100 py-2 transition-all duration-200">
                    <p className="text-primary group-hover:text-white my-auto text-sm font-extrabold transition-all duration-200">
                        Añadir otra fila
                    </p>
                    <PlusIcon className="text-primary group-hover:text-white h-5 w-5 cursor-pointer transition-all duration-200" />
                </div>
            </a>
        </div>
    )
}
