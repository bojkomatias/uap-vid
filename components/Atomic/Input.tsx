import React, { PropsWithChildren } from 'react'
import { Input } from '../../config/types'

const Input = ({ input }: PropsWithChildren<{ input: Input }>) => {
    return (
        <input
            placeholder={input.title}
            type={input.type}
            name={input.title}
            className="w-full rounded-sm p-2 placeholder:capitalize"
        />
    )
}

export default Input
