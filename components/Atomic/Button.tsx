import React from 'react'

export const Button = ({ type, children, ...buttonProps }: any) => {
    return (
        <button
            {...buttonProps}
            type={type}
            className="border-transparent focus:ring-indigo-500 group inline-flex items-center rounded border bg-secondary-600 px-4 py-2 text-sm font-light uppercase text-white shadow-sm hover:bg-primary focus:outline-none focus:ring-2 focus:ring-secondary-700 focus:ring-offset-2"
        >
            {children}
        </button>
    )
}
