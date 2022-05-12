import React, { PropsWithChildren } from 'react'
import { Input } from '../../config/types'

const Input = ({ input }: PropsWithChildren<{ input: Input }>) => {
    return (
        <input
            placeholder={input.title}
            type={input.type}
            name={input.title}
            className=" shadowInner focus:border-primary sm:text-md w-full p-3 py-2 pl-3 pr-10  capitalize shadow-inner placeholder:capitalize focus:outline-none  focus:ring-1 focus:ring-primary-100"
        />
    )
}

export default Input
