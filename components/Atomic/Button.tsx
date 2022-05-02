import React from 'react'

export const Button = ({ children, ...buttonProps }: any) => {
    return (
        <button
            {...buttonProps}
            type="button"
            className="border-transparent rounded text-white focus:ring-indigo-500 inline-flex items-center border bg-primary-700 px-4 py-2 text-base font-medium shadow-sm hover:bg-primary-600 focus:outline-none focus:ring-2 focus:ring-secondary-700 focus:ring-offset-2"
        >
            {children}
        </button>
    )
}
