import { TrashIcon, ViewGridAddIcon } from '@heroicons/react/outline'
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
        <div key={index} className="m-2 flex w-full justify-evenly gap-3">
            {headers.map((_, i) => (
                <input
                    placeholder={headers[i]}
                    key={i}
                    type="text"
                    {...table.getListInputProps('data', index, headers[i])}
                />
            ))}

            <TrashIcon
                onClick={() => table.removeListItem('data', index)}
                className="h-6 w-6 flex-shrink cursor-pointer self-end border"
            />
        </div>
    ))

    return (
        <div>
            {fields.length > 0 ? (
                <div className="flex w-full justify-evenly gap-3 border">
                    {headers.map((header, index) => (
                        <span key={index} className="text-xl font-bold">
                            {header}
                        </span>
                    ))}
                </div>
            ) : (
                <div>La lista esta vacia ...</div>
            )}

            {fields}

            <div className="m-3">
                <ViewGridAddIcon
                    onClick={() => table.addListItem('data', data.value[0])}
                    className="mx-auto h-10 w-10 cursor-pointer"
                />
            </div>
        </div>
    )
}
