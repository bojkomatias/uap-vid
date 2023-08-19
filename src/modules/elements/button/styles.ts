// This component exists, because some styles are used on the Server, and cannot be exported all together with Button file

import { cx } from '@utils/cx'

const styles = {
    // base exists but has no extra.
    unset: 'unset',
    primary:
        'bg-primary font-bold text-white shadow hover:bg-primary/90 hover:shadow-primary/50 active:scale-95 focus-visible:outline-offset-2',
    secondary:
        'bg-gray-100 font-semibold text-gray-600 hover:bg-gray-200 hover:text-gray-700',
    outline: 'text-gray-700 ring-1 hover:bg-gray-50',
    destructive: 'font-semibold text-error-600 bg-error-50 hover:bg-error-100',
}

/**
 * Here I export a HELPER for Components that can't consume the Button (eg. Link), but want to obtain the style anyways
 * Base class + styles
 */
export const buttonStyle = (
    intent: 'primary' | 'secondary' | 'outline' | 'destructive' | 'unset'
) =>
    cx(
        'group flex items-center gap-1 justify-center rounded-md px-4 py-2.5 text-sm transition duration-200 ease-out focus-visible:outline focus-visible:outline-[1.5px] focus-visible:outline-primary active:brightness-95 disabled:pointer-events-none disabled:opacity-50 disabled:saturate-50',
        styles[intent]
    )
