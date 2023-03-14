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
            <div className="m-3 p-1">
                <label className="label">{label}</label>
                <RichTextEditor
                    {...form.getInputProps(path + x)}
                    className="input h-auto min-h-[10rem] p-0"
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
        </div>
    )
}

export default Textarea
