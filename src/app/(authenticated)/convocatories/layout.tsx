import type { ReactNode } from 'react'

export default async function Layout({
  children,
  dialog,
}: {
  children: ReactNode
  dialog: ReactNode
}) {
  return (
    <>
      {dialog}
      {children}
    </>
  )
}
