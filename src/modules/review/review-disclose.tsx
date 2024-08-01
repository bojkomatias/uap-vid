'use client'

import { Button } from '@components/button'
import { useState } from 'react'
import {
  LayoutSidebarLeftExpand,
  LayoutSidebarRightExpand,
} from 'tabler-icons-react'

export function ReviewDisclose() {
  const [open, setOpen] = useState(false)

  return (
    <Button
      className="active:scale-95"
      title={!open ? 'Mostrar evaluaciones' : 'Ocultar evaluaciones'}
      outline
      onClick={() => {
        const reviewContainer = document.querySelector('#reviews-container')
        const reviewInsideContainer = document.getElementById(
          'reviews-inside-container'
        )
        const protocolContainer = document.querySelector('#protocol-container')

        const isOpen = !reviewContainer?.classList.contains('hidden')

        if (isOpen) {
          reviewInsideContainer?.classList.remove('opacity-100')
          reviewInsideContainer?.classList.add('opacity-0')

          setTimeout(() => {
            reviewContainer?.classList.remove('right-2/3')
            reviewContainer?.classList.add('right-full')
            reviewContainer?.classList.add('-left-1/2')
            reviewContainer?.classList.add('opacity-0')
            protocolContainer?.classList.remove('left-1/3')
          }, 200)

          setTimeout(() => {
            reviewContainer?.classList.add('hidden')
            setOpen(!open)
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

          setTimeout(() => {
            reviewInsideContainer?.classList.remove('opacity-0')
            reviewInsideContainer?.classList.add('opacity-100')
            setOpen(!open)
          }, 250)
        }
      }}
    >
      {!open ?
        <LayoutSidebarRightExpand data-slot="icon" />
      : <LayoutSidebarLeftExpand data-slot="icon" />}
    </Button>
  )
}
