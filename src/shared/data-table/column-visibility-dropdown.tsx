import { type ReactNode } from 'react'
import { Check, ChevronDown } from 'tabler-icons-react'
import type { Column } from '@tanstack/react-table'
import {
  Dropdown,
  DropdownButton,
  DropdownItem,
  DropdownLabel,
  DropdownMenu,
} from '@components/dropdown'

export default function ColumnVisibilityDropdown({
  columns,
}: {
  columns: Column<unknown, unknown>[]
}) {
  return (
    <Dropdown>
      <DropdownButton outline>
        Columnas
        <ChevronDown data-slot="icon" />
      </DropdownButton>
      <DropdownMenu>
        {columns.map(
          (column) =>
            column.getCanHide() && (
              <DropdownItem
                key={column.id}
                onClick={(e: any) => {
                  e.preventDefault()
                  column.toggleVisibility(!column.getIsVisible())
                }}
              >
                {column.getIsVisible() && <Check data-slot="icon" />}
                <DropdownLabel>
                  {column.columnDef.header as ReactNode}
                </DropdownLabel>
              </DropdownItem>
            )
        )}
      </DropdownMenu>
    </Dropdown>
  )
}
