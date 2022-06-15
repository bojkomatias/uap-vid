import React from 'react'

export const Button = ({ type, children, ...buttonProps }: any) => {
    return (
        <button
            {...buttonProps}
            type={type}
            className="border-transparent focus:ring-indigo-500 group my-auto inline-flex  h-20 items-center bg-base-100 px-4 py-2 text-sm font-light uppercase text-primary transition-all duration-200 hover:bg-primary  hover:text-white active:scale-95 "
        >
            {children}
        </button>
    )
}
