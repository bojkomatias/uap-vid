'use client'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import React, { useState } from 'react'
import { Message2, X } from 'tabler-icons-react'

export function ChatPopover({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <Popover className="fixed bottom-10 right-14 z-50 rounded-full border bg-primary drop-shadow-md">
      <PopoverButton
        onClick={() => {
          setOpen(!open)
        }}
        className=" flex h-12 w-12 items-center justify-center text-white outline-primary-950 focus:outline-none"
      >
        <Message2 className="active:scale-75" />
      </PopoverButton>
      <PopoverPanel
        transition
        anchor="top"
        className="mb-4 w-[80vw] -translate-x-8 -translate-y-4 rounded-xl border bg-white p-4 shadow-2xl transition duration-200 ease-out data-[closed]:scale-95 data-[closed]:opacity-0 md:w-[50vw] xl:w-[30vw]"
      >
        {children}
      </PopoverPanel>
    </Popover>
  )
}
