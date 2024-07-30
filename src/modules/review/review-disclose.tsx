'use client'

import { Button } from '@components/button'
import { LayoutSidebarLeftExpand } from 'tabler-icons-react'

export function ReviewDisclose() {
  return (
    <Button
      title="Mostrar revisiones"
      outline
      onClick={() => {
        const reviewContainer = document.querySelector('#reviews-container')
        const protocolContainer = document.querySelector('#protocol-container')

        const isOpen = !reviewContainer?.classList.contains('hidden')

        if (isOpen) {
          reviewContainer?.classList.remove('right-2/3')
          reviewContainer?.classList.add('right-full')
          reviewContainer?.classList.add('-left-1/2')
          reviewContainer?.classList.add('opacity-0')
          protocolContainer?.classList.remove('left-1/3')

          setTimeout(() => {
            reviewContainer?.classList.add('hidden')
          }, 300)
        } else {
          reviewContainer?.classList.remove('hidden')
          setTimeout(() => {
            reviewContainer?.classList.add('right-2/3')
            reviewContainer?.classList.remove('right-full')
            reviewContainer?.classList.remove('-left-1/2')
            reviewContainer?.classList.remove('opacity-0')
            protocolContainer?.classList.add('left-1/3')
          }, 1)
        }
      }}
    >
      <LayoutSidebarLeftExpand data-slot="icon" />
    </Button>
  )
}
