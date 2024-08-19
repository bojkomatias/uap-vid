import type { ReactNode } from 'react'
import { Button } from '@components/button'
import { Loader2 } from 'tabler-icons-react'

export function FormButton({
  children,
  isLoading,
  disabled,
}: {
  children: ReactNode
  isLoading?: boolean
  disabled?: boolean
}) {
  return (
    <Button className="relative" type="submit" disabled={disabled || isLoading}>
      <span className={isLoading ? 'opacity-0' : ''}>{children}</span>
      {isLoading && <Loader2 className="absolute animate-spin" />}
    </Button>
  )
}
