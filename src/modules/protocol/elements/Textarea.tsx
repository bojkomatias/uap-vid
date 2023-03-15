import { PropsWithChildren, useEffect, useState } from 'react'
import { useProtocolContext } from '../../../utils/createContext'
import RichTextEditor from '../../elements/RTE'

const Textarea = ({
    path,
    x,
    label,
}: PropsWithChildren<{ path: string; x: string; label: string }>) => {
    const form = useProtocolContext()

    return (
        <div>
            <label className="label">{label}</label>
            <RichTextEditor
                {...form.getInputProps(path + x)}
                className="input h-auto min-h-[10rem] pt-0 border-gray-200"
                placeholder={label}
                sticky={false}
                radius={0}
                controls={[
                    ['bold', 'italic', 'underline'],
                    ['h1', 'h2', 'h3'],
                    ['alignLeft', 'alignCenter', 'alignRight'],
                    ['link'],
                ]}
            />
        </div>
    )
}

export default Textarea
