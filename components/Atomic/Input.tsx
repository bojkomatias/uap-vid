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
            defaultValue={input.value}
            required
            onChange={async (e) =>
                updateData({
                    title: input.title,
                    type: input.type,
                    value: e.target.value,
                })
            }
            className="input"
        />
    )
}

export default Input
