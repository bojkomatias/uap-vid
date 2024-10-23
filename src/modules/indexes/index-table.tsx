import { Badge } from '@components/badge'
import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Table,
} from '@components/table'
import type { HistoricIndex } from '@prisma/client'
import { currencyFormatter, dateFormatter } from '@utils/formatters'

export function IndexTable({ values }: { values: HistoricIndex[] }) {
  return (
    <Table
      bleed
      className="[--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]"
    >
      <TableHead>
        <TableRow>
          <TableHeader>Monto ($)</TableHeader>
          <TableHeader>Activo</TableHeader>
          <TableHeader>Periodo</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {values.slice(0, 3).map((value) => (
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
  )
}
