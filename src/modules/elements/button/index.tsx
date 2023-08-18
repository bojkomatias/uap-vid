'use client'
import { cx } from '@utils/cx'
import type { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react'
import { buttonStyle } from './styles'

interface Props
    extends DetailedHTMLProps<
        ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    > {
    intent: 'primary' | 'secondary' | 'outline' | 'destructive' | 'unset'
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
            className={cx(buttonStyle(intent), className)}
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
