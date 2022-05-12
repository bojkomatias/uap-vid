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
            onChange={(e) =>
                updateData({
                    [input.title]: e.target.value,
                })
            }
            className="shadowInner sm:text-md focus:ring-primary-100 w-full p-3 py-2 pl-3 pr-10  capitalize shadow-inner placeholder:capitalize focus:border-primary  focus:outline-none focus:ring-1"
        />
    )
}

export default Input
