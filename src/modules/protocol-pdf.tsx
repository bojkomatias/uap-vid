'use client'

import { Button } from '@components/button'

export const PDF = () => {
  return (
    <Button
      className="float-right print:hidden"
      color="light"
      onClick={() => {
        const htmlTag = document.querySelector('html')!
        const isDark = htmlTag.classList.contains('dark')

        if (isDark) htmlTag.classList.remove('dark')
        window.print()
        if (isDark) htmlTag.classList.add('dark')
      }}
    >
      Descargar PDF
    </Button>
  )
}
