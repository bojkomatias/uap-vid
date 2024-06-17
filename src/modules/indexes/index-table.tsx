import { Badge } from '@components/badge'
import {
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  Table,
} from '@components/table'
import { HistoricIndex } from '@prisma/client'
import { dateFormatter } from '@utils/formatters'

export function IndexTable({ values }: { values: HistoricIndex[] }) {
  return (
    <Table bleed>
      <TableHead>
        <TableRow>
          <TableHeader>Monto</TableHeader>
          <TableHeader>Activo</TableHeader>
          <TableHeader>Periodo</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {values.map((value) => (
          <TableRow key={value.price}>
            <TableCell className="font-medium">{value.price}</TableCell>
            <TableCell className="font-medium">
              {value.to ? null : <Badge color="green">Actual</Badge>}
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
