import type { ReactNode } from 'react'
import { Button, ButtonProps } from '@components/button'
import { Loader2 } from 'tabler-icons-react'
import { cx } from '@utils/cx'

export function SubmitButton({
  isLoading,
  children,
  disabled,

  ...props
}: {
  isLoading?: boolean
} & ButtonProps) {
  return (
    <Button
      {...props}
      className={cx('relative', props.className)}
      type="submit"
      disabled={disabled || isLoading}
    >
      <span className={isLoading ? 'opacity-0' : ''}>{children}</span>
      {isLoading && <Loader2 className="absolute animate-spin" />}
    </Button>
  )
}
