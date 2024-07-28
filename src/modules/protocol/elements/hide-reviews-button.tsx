'use client'
import { Button } from '@components/button'
import React, { useState } from 'react'
import {
  LayoutSidebarLeftCollapse,
  LayoutSidebarRightCollapse,
} from 'tabler-icons-react'

export default function HideReviewsButton() {
  const [open, setOpen] = useState(false)

  return (
    <Button
      title={open ? 'Mostrar revisiones' : 'Ocultar revisiones'}
      className="-translate-y-2 print:hidden"
      outline
      onClick={() => {
        const container = document.getElementById(
          'protocol-and-reviews-container'
        )
        const child = document.getElementById('reviews-container')
        const protocol = document.getElementById('col-span-full')

        const condition = child?.classList.contains('hidden')

        if (!condition) {
          child?.classList.toggle('!-translate-x-[120%]')
          protocol?.classList.toggle('cols-span-full')

          setTimeout(() => {
            child?.classList.toggle('hidden')
            container?.classList.toggle('lg:grid-cols-10')
            setOpen(true)
          }, 300)
        } else {
          child?.classList.toggle('hidden')
          container?.classList.toggle('lg:grid-cols-10')
          setTimeout(() => {
            child?.classList.toggle('!-translate-x-[120%]')
            protocol?.classList.toggle('cols-span-full')
            setOpen(false)
          }, 50)
        }
      }}
    >
      {open ?
        <LayoutSidebarRightCollapse data-slot="icon" />
      : <LayoutSidebarLeftCollapse data-slot="icon" />}
    </Button>
  )
}
