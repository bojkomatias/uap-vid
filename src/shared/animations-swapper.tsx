'use client'

import { useEffect } from 'react'
import { Listbox, ListboxLabel, ListboxOption } from '@components/listbox'
import { atom, useAtom } from 'jotai'

type swapType = 'true' | 'false'

const LOCAL_STORAGE_KEY = 'animations-swap-value'

// Initialize atom with value from localStorage or default to 'true'
const getInitialValue = (): swapType => {
  if (typeof window !== 'undefined') {
    const storedValue = localStorage.getItem(LOCAL_STORAGE_KEY)
    return storedValue === 'true' || storedValue === 'false' ?
        storedValue
      : 'true'
  }
  return 'true'
}

export const animationsSwapAtom = atom<swapType>(getInitialValue())

export function AnimationsSwapper() {
  const [value, setValue] = useAtom(animationsSwapAtom)

  useEffect(() => {
    localStorage.setItem(LOCAL_STORAGE_KEY, value)
  }, [value])

  return (
    <Listbox
      name="animations-swapper"
      defaultValue={value}
      value={value}
      onChange={(e) => {
        setValue(e as swapType)
      }}
    >
      <ListboxOption value="true">
        <ListboxLabel>Activar</ListboxLabel>
      </ListboxOption>
      <ListboxOption value="false">
        <ListboxLabel>Desactivar</ListboxLabel>
      </ListboxOption>
    </Listbox>
  )
}
