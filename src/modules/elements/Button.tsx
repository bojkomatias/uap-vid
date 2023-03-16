import clsx from 'clsx'
import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react'

const styles = {
    primary:
        'text-primary outline-none hover:bg-primary hover:text-white hover:scale-[102%] bg-base-100',
    secondary:
        'text-xs ring-1 ring-inset focus:ring-offset-0 ring-gray-200 hover:ring-primary hover:ring-2 hover:bg-gray-50 hover:text-primary text-gray-700',
}

interface Props
    extends DetailedHTMLProps<
        ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
    > {
    intent?: 'primary' | 'secondary'
    className?: string
    type?: 'button' | 'reset' | 'submit'
    children: ReactNode
}
export const Button = ({
    intent = 'primary',
    className,
    type = 'button',
    children,
    ...buttonProps
}: Props) => {
    return (
        <button
            {...buttonProps}
            type={type}
            className={clsx(
                className,
                styles[intent],
                'group flex items-center justify-center rounded-md px-4 py-3 text-sm font-semibold uppercase shadow-primary/30 transition duration-200 ease-out hover:shadow focus:ring-2 focus:ring-primary focus:ring-offset-2 active:scale-[98%] disabled:pointer-events-none disabled:text-base-200 disabled:opacity-75 disabled:saturate-0'
            )}
        >
            {children}
        </button>
    )
}
