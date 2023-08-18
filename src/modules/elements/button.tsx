'use client'
import { cx } from '@utils/cx'
import type { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react'

const styles = {
    // base exists but has no extra.
    unset: 'unset',
    primary:
        'bg-primary font-semibold text-white shadow hover:bg-primary/90 hover:shadow-primary/50 active:scale-95 focus-visible:outline-offset-2',
    secondary:
        'bg-gray-100 font-medium text-gray-800 hover:bg-gray-200 hover:text-gray-700',
    outline: 'font-medium text-gray-700 ring-1 ring-gray-300 hover:bg-gray-50',
}

interface Props
    extends DetailedHTMLProps<
        ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    > {
    intent: 'primary' | 'secondary' | 'outline' | 'unset'
    className?: string
    type?: 'button' | 'reset' | 'submit'
    loading?: boolean
    children: ReactNode
}
export const Button = ({
    intent,
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
                'group flex items-center justify-center rounded-md px-4 py-2.5 text-sm transition duration-200 ease-out focus-visible:outline focus-visible:outline-[1.5px] focus-visible:outline-primary active:brightness-95 disabled:pointer-events-none disabled:brightness-90 disabled:saturate-50',
                styles[intent],
                className
            )}
        >
            {loading ? (
                intent === 'primary' ? (
                    <span className="loader h-5 w-5" />
                ) : (
                    <span className="loader-primary h-5 w-5" />
                )
            ) : (
                children
            )}
        </button>
    )
}
/**
 * Here I export a HELPER for Components that can't consume the Button (eg. Link), but want to obtain the style anyways
 * Base class + styles
 */
export const buttonStyle = (
    intent: 'primary' | 'secondary' | 'outline' | 'unset'
) =>
    cx(
        'group flex items-center justify-center rounded-md px-4 py-2.5 text-sm transition duration-200 ease-out focus-visible:outline focus-visible:outline-[1.5px] focus-visible:outline-primary active:brightness-95 disabled:pointer-events-none disabled:brightness-90 disabled:saturate-50',
        styles[intent]
    )
