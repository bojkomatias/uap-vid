'use client'

import { Listbox, ListboxLabel, ListboxOption } from '@components/listbox'
import { atom, useAtom } from 'jotai'

type swapType = 'default' | 'fca' | 'fmr'

export const indexSwapAtom = atom<swapType>('default')

export function IndexSwapper() {
  const [value, setValue] = useAtom(indexSwapAtom)

  return (
    <Listbox
      name="index"
      defaultValue="fmr"
      value={value}
      onChange={(e) => {
        setValue(e as swapType)
      }}
    >
      <ListboxOption value="default">
        <ListboxLabel>Pesos (ARS)</ListboxLabel>
      </ListboxOption>
      <ListboxOption value="fca">
        <ListboxLabel>FCA</ListboxLabel>
      </ListboxOption>
      <ListboxOption value="fmr">
        <ListboxLabel>FMR</ListboxLabel>
      </ListboxOption>
    </Listbox>
  )
}
