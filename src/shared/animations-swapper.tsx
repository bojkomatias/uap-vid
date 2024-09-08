'use client'

import { atom, useAtom } from 'jotai'
import { DropdownItem, DropdownLabel } from '@components/dropdown'
import { EaseInOut, EaseInOutControlPoints } from 'tabler-icons-react'

const LOCAL_STORAGE_KEY = 'animations-swap-value'

// Initialize atom with value from localStorage or default to 'true'
const getInitialValue = (): boolean => {
  if (typeof window !== 'undefined') {
    const storedValue = localStorage.getItem(LOCAL_STORAGE_KEY)
    return storedValue === 'true' || storedValue === 'false' ?
        JSON.parse(storedValue)
      : true
  }
  return true
}

export const animationsSwapAtom = atom<boolean>(getInitialValue())

export function AnimationsSwapper() {
  const [value, setValue] = useAtom(animationsSwapAtom)

  return (
    <DropdownItem
      onClick={() => {
        setValue((e) => !e)
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(value))
      }}
    >
      {value ?
        <EaseInOut data-slot="icon" />
      : <EaseInOutControlPoints data-slot="icon" />}
      <DropdownLabel>{value ? 'Desactivar' : 'Activar'}</DropdownLabel>
    </DropdownItem>
  )
}
