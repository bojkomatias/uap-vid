import Input from './input'
import Select from './select'
import { Plus, Trash } from 'tabler-icons-react'
import CurrencyInput from './currency-input'
import { useProtocolContext } from '@utils/createContext'
import { Button } from '@elements/button'
import NumberInput from './number-input'
import { cache } from 'react'

type Header = {
    x: string
    label: string
    hidden?: true
    options?: string[]
    class?: string
    currency?: boolean
    number?: boolean
}
type InsertedItemFormat = { [key: string]: string | string[] | number }

const preprocess = cache((array: InsertedItemFormat[], key: string) => {
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
})

export function InputList(props: {
    path: string
    label: string
    headers: Header[]
    insertedItemFormat: InsertedItemFormat
    preprocessKey?: string
}) {
    const form = useProtocolContext()

    const data: InsertedItemFormat[] = form.getInputProps(props.path).value
    // If no preprocessed key, just default to the mapping the value itself
    const arraysOfData = props.preprocessKey
        ? preprocess(data, props.preprocessKey)
        : []

    return (
        <InputListWrapper label={props.label}>
            {props.preprocessKey ? (
                arraysOfData.map(({ key, array }, i) => (
                    <>
                        <label className="label text-sm text-gray-800">
                            {key}
                        </label>
                        <PreprocessFieldsMap
                            {...props}
                            fieldsToMap={array}
                            deepPushPath={`${i}.data`}
                        />
                    </>
                ))
            ) : (
                <FieldsMap {...props} fieldsToMap={data} />
            )}
        </InputListWrapper>
    )
}

function PreprocessFieldsMap({
    fieldsToMap,
    path,
    headers,
    insertedItemFormat,
    deepPushPath = '',
}: {
    path: string
    fieldsToMap: (string | number)[]
    headers: Header[]
    insertedItemFormat: InsertedItemFormat
    deepPushPath?: string
}) {
    const form = useProtocolContext()

    const fields = fieldsToMap.map((_, index) => (
        <div
            key={deepPushPath + index}
            id={`row-${deepPushPath}.${index}`}
            className="flex w-full items-start justify-around gap-2"
        >
            {headers.map((h: Header) => (
                <div className={h.class} key={h.x + deepPushPath + index}>
                    {h.options ? (
                        <Select
                            options={h.options}
                            path={`${path}.${deepPushPath}.${index}`}
                            label={h.label}
                        />
                    ) : h.currency ? (
                        <CurrencyInput
                            path={`${path}.${deepPushPath}.${index}`}
                            label={h.label}
                        />
                    ) : h.number ? (
                        <NumberInput
                            path={`${path}.${deepPushPath}.${index}`}
                            label={h.label}
                        />
                    ) : (
                        <Input
                            path={`${path}.${deepPushPath}.${index}.${h.x}`}
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
        <>
            {/* {fields.length === 0 ? (
                <div className="label text-center text-primary">
                    La lista esta vacía ...
                </div>
            ) : null} */}
            {fields}
            <Button
                onClick={() => {
                    form.insertListItem(
                        `${path}.${deepPushPath}`,
                        insertedItemFormat
                    )

                    /* Esto es una chanchada, habría que mejorarlo*/
                    setTimeout(() => {
                        document
                            .getElementById(`row-${fields.length}`)
                            ?.getElementsByTagName('input')[0]
                            .focus()
                    }, 10)
                }}
                intent="secondary"
                className="mx-auto w-full max-w-xs"
            >
                <p> Añadir otra fila </p>
                <Plus className="h-5" />
            </Button>
        </>
    )
}

function FieldsMap({
    fieldsToMap,
    path,
    headers,
    insertedItemFormat,
}: {
    path: string
    fieldsToMap: InsertedItemFormat[]
    headers: Header[]
    insertedItemFormat: InsertedItemFormat
}) {
    const form = useProtocolContext()

    const fields = fieldsToMap.map((_, index) => (
        <div
            key={index}
            id={`row-${index}`}
            className="flex w-full items-start justify-around gap-2"
        >
            {headers.map((h: Header) => (
                <div className={h.class} key={h.x + index}>
                    {h.options ? (
                        <Select
                            options={h.options}
                            path={`${path}.${index}.${h.x}`}
                            label={h.label}
                        />
                    ) : h.currency ? (
                        <CurrencyInput
                            path={`${path}.${index}.${h.x}`}
                            label={h.label}
                        />
                    ) : h.number ? (
                        <NumberInput
                            path={`${path}.${index}.${h.x}`}
                            label={h.label}
                        />
                    ) : (
                        <Input
                            path={`${path}.${index}.${h.x}`}
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
        <>
            {/* {fields.length === 0 ? (
                <div className="label text-center text-primary">
                    La lista esta vacía ...
                </div>
            ) : null} */}
            {fields}
            <Button
                onClick={() => {
                    form.insertListItem(path, insertedItemFormat)

                    /* Esto es una chanchada, habría que mejorarlo*/
                    setTimeout(() => {
                        document
                            .getElementById(`row-${fields.length}`)
                            ?.getElementsByTagName('input')[0]
                            .focus()
                    }, 10)
                }}
                intent="secondary"
                className="mx-auto w-full max-w-xs"
            >
                <p> Añadir otra fila </p>
                <Plus className="h-5" />
            </Button>
        </>
    )
}

function InputListWrapper({
    label,
    children,
}: {
    label: string
    children: React.ReactNode
}) {
    return (
        <div>
            <div className="label text-center">{label}</div>
            <div className="space-y-3 rounded-xl border px-4 pb-2 pt-6">
                {children}
            </div>
        </div>
    )
}
