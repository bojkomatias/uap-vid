'use client'
import { Button } from '@components/button'
import { Pin as PinIcon } from 'tabler-icons-react'
import React, { useState } from 'react'
import { cx } from '@utils/cx'

export default function PinComponent() {
  const [pinned, setPinned] = useState(false)

  return (
    <Button
      onClick={() => {
        if (pinned) setPinned(false)
        else setPinned(true)
        document
          .getElementById('metadata-container')
          ?.classList.toggle('sticky')
      }}
      className={cx('h-9', pinned && 'bg-gray-600')}
      outline
    >
      <PinIcon className={cx(pinned && '!text-gray-100')} data-slot="icon" />
    </Button>
  )
}
