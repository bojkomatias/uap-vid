import clsx from 'clsx'
import { ButtonHTMLAttributes, DetailedHTMLProps, ReactNode } from 'react'

const styles = {
    primary:
        'text-primary outline-none hover:bg-primary hover:text-white hover:scale-[102%] bg-base-100',
    secondary:
        'text-xs ring-1 ring-inset focus:ring-offset-0 ring-gray-300 hover:ring-primary hover:ring-2 hover:bg-gray-50 hover:text-primary text-gray-700',
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
                'uppercase rounded group flex items-center font-semibold text-sm justify-center px-4 py-3 active:scale-[98%] hover:shadow shadow-primary/30 disabled:pointer-events-none disabled:text-base-200 disabled:saturate-0 focus:ring-2 focus:ring-offset-2 focus:ring-primary transition duration-200 ease-out'
            )}
        >
            {children}
        </button>
    )
}
