'use client'
import clsx from 'clsx'
import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react'

const styles = {
    primary:
        'text-primary outline-none hover:bg-primary hover:text-white hover:scale-[102%] bg-base-100',
    secondary:
        'text-xs ring-1 bg-white focus:ring-offset-0 ring-gray-200 hover:ring-primary hover:ring-2 hover:bg-gray-50 hover:text-primary text-gray-700',
    tertiary:
        'text-xs ring-1 focus:ring-offset-0 ring-gray-200 hover:ring-primary hover:ring-2 hover:bg-gray-50 hover:text-primary text-gray-700 active:bg-primary active:text-white',
}

interface Props
    extends DetailedHTMLProps<
        ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    > {
    intent?: 'primary' | 'secondary' | 'tertiary'
    className?: string
    type?: 'button' | 'reset' | 'submit'
    loading?: boolean
    children: ReactNode
}
export const Button = ({
    intent = 'primary',
    className,
    type = 'button',
    loading = false,
    children,
    ...buttonProps
}: Props) => {
    return (
        <button
            {...buttonProps}
            disabled={loading}
            type={type}
            className={clsx(
                className,
                styles[intent],
                'group flex items-center justify-center rounded-md px-4 py-3 text-sm font-semibold uppercase shadow-primary/30 transition duration-200 ease-out hover:shadow focus:ring-2 focus:ring-primary focus:ring-offset-2 active:scale-[98%] disabled:pointer-events-none disabled:text-base-300  disabled:saturate-0'
            )}
        >
            {loading ? <span className="loader-primary h-5 w-5" /> : children}
        </button>
    )
}
