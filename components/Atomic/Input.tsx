import React, { PropsWithChildren } from 'react'
import { Input } from '../../config/types'

const Input = ({
    input,
    updateData,
}: PropsWithChildren<{ input: Input; updateData: Function }>) => {
    return (
        <input
            placeholder={input.title}
            type={input.type}
            name={input.title}
            className="w-full rounded-sm p-2 placeholder:capitalize"
            onChange={(e) =>
                updateData({
                    [input.title]: e.target.value,
                })
            }
        />
    )
}

export default Input
