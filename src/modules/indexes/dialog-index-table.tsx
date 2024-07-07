'use client'

import { Badge } from '@components/badge'
import { Button } from '@components/button'
import {
  Dialog,
  DialogActions,
  DialogBody,
  DialogDescription,
  DialogTitle,
} from '@components/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/table'
import type { HistoricIndex } from '@prisma/client'
import { currencyFormatter, dateFormatter } from '@utils/formatters'
import { useState } from 'react'

export function DialogTableIndex({ values }: { values: HistoricIndex[] }) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="dark:tex-white font-semibold text-gray-950 underline underline-offset-2"
      >
        todos
      </button>
      <Dialog open={open} onClose={setOpen} size="3xl">
        <DialogTitle>Total de valores historicos</DialogTitle>
        <DialogDescription>
          Lista del total de valores historicos del indice FCA desde su
          implementación.
        </DialogDescription>
        <DialogBody>
          <Table bleed dense>
            <TableHead>
              <TableRow>
                <TableHeader>Monto ($)</TableHeader>
                <TableHeader>Activo</TableHeader>
                <TableHeader>Periodo</TableHeader>
              </TableRow>
            </TableHead>
            <TableBody>
              {values.map((value) => (
                <TableRow key={value.price}>
                  <TableCell className="font-medium">
                    {currencyFormatter.format(value.price)}
                  </TableCell>
                  <TableCell className="font-medium">
                    {value.to ? null : <Badge color="teal">Actual</Badge>}
                  </TableCell>
                  <TableCell>
                    Desde:{' '}
                    <span className="font-medium">
                      {dateFormatter.format(value.from)}
                    </span>
                    {value.to && ' hasta: '}
                    {value.to && (
                      <span className="font-medium">
                        {dateFormatter.format(value.to)}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogBody>
        <DialogActions>
          <Button onMouseDown={() => setOpen(false)} plain>
            Cerrar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
