// This component exists, because some styles are used on the Server, and cannot be exported all together with Button file
import { cx } from '@utils/cx'

const styles = {
  // base exists but has no extra.
  unset: 'unset',
  primary:
    'bg-primary font-bold text-white shadow hover:bg-primary/90 hover:shadow-primary/50 active:scale-95 focus-visible:outline-offset-2',
  secondary:
    'bg-gray-100 font-semibold text-gray-600 hover:bg-primary-100 hover:text-gray-800',
  outline:
    'text-gray-700 font-medium ring-1 hover:bg-gray-50 bg-white ring-inset',
  destructive: 'font-semibold text-red-600 bg-red-50 hover:bg-red-100',
  warning: 'font-semibold text-yellow-600 bg-yellow-50 hover:bg-yellow-100',
}
const sizes = {
  xs: 'text-xs h-6 px-2',
  sm: 'text-[0.81rem] h-[2.125rem] px-2.5',
  md: 'text-sm h-10 px-3',
  lg: 'text-base h-11 px-4',
  icon: 'h-8 w-8 p-0',
  'icon-lg': 'h-12 w-12 p-0',
}

/**
 * Here I export a HELPER for Components that can't consume the Button (eg. Link), but want to obtain the style anyways
 * Base class + styles
 */

export const buttonStyle = (
  intent:
    | 'primary'
    | 'secondary'
    | 'outline'
    | 'destructive'
    | 'warning'
    | 'unset',
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'icon' | 'icon-lg'
) =>
  cx(
    `group whitespace-nowrap flex items-center gap-1.5 justify-center rounded-md transition duration-200 ease-out focus-visible:outline focus-visible:outline-[1.5px] focus-visible:outline-primary active:brightness-95 disabled:pointer-events-none disabled:opacity-50 disabled:saturate-50`,
    styles[intent],
    sizes[size ?? 'sm']
  )
