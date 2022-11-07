import { PropsWithChildren, useEffect, useState } from 'react'
import { useProtocolContext } from '../../config/createContext'

function handleKeyDown(e: any) {
    //Para hacer autoresize del textarea
    e.target.style.height = 'inherit'
    e.target.style.height = `${e.target.scrollHeight}px`
}

const Textarea = ({
    path,
    x,
    label,
}: PropsWithChildren<{ path: string; x: string; label: string }>) => {
    const form = useProtocolContext()

    return (
        <div className="m-3 p-1">
            <label
                className={`text-xs font-normal  uppercase 
                            text-base-700/60`}
            >
                {label}
            </label>
            <textarea
                {...form.getInputProps(path + x)}
                onKeyDown={handleKeyDown}
                className="input"
                placeholder={label}
            />
        </div>
    )
}

export default Textarea
