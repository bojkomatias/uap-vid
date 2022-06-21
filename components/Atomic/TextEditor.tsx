import { PropsWithChildren, useEffect, useState } from 'react'
import { Input } from '../../config/types'
import RTLoader from './RTLoader'

const TextEditor = ({
    data,
    updateData,
}: PropsWithChildren<{ data: Input; updateData: Function }>) => {
    const [value, onChange] = useState(data.value)
    useEffect(() => {
        console.log('valeu', value)
        updateData({
            type: data.type,
            title: data.title,
            value: value,
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    return (
        <RTLoader
            value={value}
            onChange={onChange}
            className="input min-h-[35vh]"
        />
    )
}

export default TextEditor
