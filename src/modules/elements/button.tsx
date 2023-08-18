'use client'
import { cx } from '@utils/cx'
import type { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react'

const styles = {
    primary:
        'text-primary outline-none hover:bg-primary hover:text-white hover:scale-[102%] bg-base-100 hover:shadow focus:ring-2 focus:ring-primary focus:ring-offset-2',
    secondary:
        'text-xs ring-1 bg-white ring-gray-200 hover:ring-primary hover:ring-2 hover:bg-gray-50 hover:text-primary text-gray-700 hover:shadow',
    tertiary:
        'text-xs ring-1 ring-gray-200 hover:ring-primary hover:ring-2 hover:bg-gray-50 hover:text-primary text-gray-700 active:bg-primary active:text-white',
    special:
        'text-xs ring-1 ring-base-50 hover:ring-primary hover:ring-2 hover:bg-gray-50 hover:text-primary text-gray-700 active:bg-primary active:text-white bg-base-100/70 active:scale-95',
    badge: 'rounded-full px-3 py-1 text-xs ring-1 ring-black/5 bg-gray-50 hover:bg-gray-100 text-gray-700 hover:ring-black/30',
}

interface Props
    extends DetailedHTMLProps<
        ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    > {
    intent?: 'primary' | 'secondary' | 'tertiary' | 'special' | 'badge'
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
            disabled={loading || buttonProps.disabled}
            type={type}
            className={cx(
                'group flex items-center justify-center rounded-md px-4 py-3 text-sm font-semibold uppercase shadow-primary/30 transition duration-200 ease-out  active:scale-[98%] disabled:pointer-events-none disabled:text-base-300  disabled:saturate-0',
                styles[intent],
                className
            )}
        >
            {loading ? <span className="loader-primary h-5 w-5" /> : children}
        </button>
    )
}
