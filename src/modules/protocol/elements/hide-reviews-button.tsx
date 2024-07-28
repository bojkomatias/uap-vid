'use client'
import React from 'react'
import { LayoutSidebarLeftCollapse } from 'tabler-icons-react'

export default function HideReviewsButton() {
  return (
    <LayoutSidebarLeftCollapse
      onClick={() => {
        const container = document.getElementById(
          'protocol-and-reviews-container'
        )
        const child = document.getElementById('reviews-container')

        container?.classList.toggle('lg:grid-cols-10')
        child?.classList.toggle('cols-span-4')
      }}
      className="size-5 stroke-gray-500"
    />
  )
}
