import type { ReactNode } from 'react'
import { Button } from '@components/button'
import { Loader2 } from 'tabler-icons-react'

export function FormButton({
  children,
  isLoading,
  enabled,
}: {
  children: ReactNode
  isLoading?: boolean
  enabled?: boolean
}) {
  return (
    <Button className="relative" type="submit" disabled={enabled || isLoading}>
      <span className={isLoading ? 'opacity-0' : ''}>{children}</span>
      {isLoading && <Loader2 className="absolute animate-spin" />}
    </Button>
  )
}
