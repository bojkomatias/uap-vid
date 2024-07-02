'use client'
import { cx } from '@utils/cx'
import type { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react'
import { buttonStyle } from './styles'

interface Props
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  intent:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'destructive'
    | 'warning'
    | 'unset'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'icon' | 'icon-lg'
  className?: string
  type?: 'button' | 'reset' | 'submit'
  loading?: boolean
  children: ReactNode
}
export const Button = ({
  intent,
  size,
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
      className={cx(buttonStyle(intent, size), className)}
    >
      {loading ?
        intent === 'primary' ?
          <span className="loader h-4 w-4" />
        : <span className="loader-primary h-4 w-4" />
      : children}
    </button>
  )
}
