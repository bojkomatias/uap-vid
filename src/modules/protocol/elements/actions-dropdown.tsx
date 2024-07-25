'use client'

import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '@components/dropdown'
import type { Action } from '@prisma/client'
import type { ReactNode } from 'react'
import { ChevronDown } from 'tabler-icons-react'

export type ActionOption = {
  action: Action
  name: string
  icon: ReactNode
} & (
  | { callback: () => void; href?: never }
  | { href: string; callback?: never }
)

export function ActionsDropdown({ actions }: { actions: ActionOption[] }) {
  return (
    <Dropdown>
      <DropdownButton outline>
        Options
        <ChevronDown data-slot="icon" />
      </DropdownButton>
      <DropdownMenu anchor="bottom">
        {actions.map((x) =>
          x.href ?
            <DropdownItem key={x.action} href={x.href}>
              {x.icon}
              <DropdownLabel>{x.name}</DropdownLabel>
            </DropdownItem>
          : <DropdownItem
              key={x.action}
              onClick={() => {
                if (x.callback) x.callback()
              }}
            >
              {x.icon}
              <DropdownLabel>{x.name}</DropdownLabel>
            </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  )
}
