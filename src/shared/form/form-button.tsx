import type { ReactNode } from 'react'
import { Button } from '@components/button'

export function FormButton({
  children,
  isLoading,
}: {
  children: ReactNode
  isLoading?: boolean
}) {
  return (
    <Button type="submit" disabled={isLoading}>
      {children}
    </Button>
  )
}
