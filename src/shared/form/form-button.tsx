import type { ReactNode } from 'react'
import { Button } from '@components/button'

export function FormButton({
  children,
  isLoading,
  form,
}: {
  children: ReactNode
  isLoading: boolean
  form?: string
}) {
  return (
    <Button form={form} type="submit" disabled={isLoading}>
      {children}
    </Button>
  )
}
