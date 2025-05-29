'use client'

import { Button } from '@components/button'
import { getProtocolBudgetData } from '@repositories/protocol'
import { ProtocolStatesDictionary } from '@utils/dictionaries/ProtocolStatesDictionary'
import ExcelJS from 'exceljs'
import { useState } from 'react'
import {
  Dialog,
  DialogTitle,
  DialogBody,
  DialogActions,
} from '@components/dialog'
import { Download } from 'tabler-icons-react'
import { useQuery } from '@tanstack/react-query'
import { getAnualBudgetYears } from '@repositories/anual-budget'

type TeamMember = {
  protocolNumber: string | null
  name: string
  role: string | null
  category: string
  hoursAssigned: number
  workingMonths: number
  hourlyPrice: number
  totalCost: number
}

type ProtocolData = {
  projectTitle: string
  academicUnits: string[]
  teamMembers: TeamMember[]
  expenses?: { name: string; amount: number }[]
  createdAt: Date | null
  state: string
  yearWithDuration: string
}

const HEADERS = [
  'Número de protocolo',
  'Título del proyecto',
  'Año y Duración',
  'Estado',
  'Nombre del miembro del equipo',
  'Rol/Concepto',
  'Categoría',
  'Horas asignadas',
  'Meses laborales',
  'Valor hora',
  'Costo total',
]

const escapeCSV = (field: string | number) => {
  const s = String(field)
  return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s
}

const generateCSV = (data: ProtocolData[]) => {
  // Group data by academic unit
  const groupedData = data.reduce(
    (acc, protocol) => {
      protocol.academicUnits.forEach((unitName) => {
        if (!acc[unitName]) {
          acc[unitName] = []
        }
        acc[unitName].push(protocol)
      })
      return acc
    },
    {} as Record<string, ProtocolData[]>
  )

  const rows = [HEADERS.map(escapeCSV).join(',')]

  // Add data for each academic unit
  Object.entries(groupedData).forEach(([unitName, protocols]) => {
    // Add academic unit header
    rows.push(
      [escapeCSV(unitName), '', '', '', '', '', '', '', '', '', ''].join(',')
    )

    protocols.forEach((protocol) => {
      protocol.teamMembers.forEach((member, i) => {
        rows.push(
          [
            i === 0 ? escapeCSV(member.protocolNumber ?? '') : '',
            i === 0 ? escapeCSV(protocol.projectTitle) : '',
            i === 0 ? escapeCSV(protocol.yearWithDuration) : '',
            i === 0 ?
              escapeCSV(
                ProtocolStatesDictionary[
                  protocol.state as keyof typeof ProtocolStatesDictionary
                ]
              )
            : '',
            escapeCSV(member.name),
            escapeCSV(member.role ?? ''),
            escapeCSV(member.category),
            escapeCSV(member.hoursAssigned),
            escapeCSV(member.workingMonths),
            escapeCSV(member.hourlyPrice),
            escapeCSV(member.totalCost),
          ].join(',')
        )
      })

      protocol.expenses?.forEach((expense) => {
        rows.push(
          [
            '', // Protocol Number
            '', // Project Title
            '', // Year and Duration
            '', // State
            escapeCSV(expense.name), // Team Member Name
            'Gasto Directo', // Role
            '', // Category
            '', // Hours Assigned
            '', // Working Months
            '', // Hourly Price
            escapeCSV(expense.amount), // Total Cost
          ].join(',')
        )
      })
    })
  })

  return rows.join('\n')
}

const generateXLSX = async (data: ProtocolData[]) => {
  const wb = new ExcelJS.Workbook()
  const ws = wb.addWorksheet('Protocol Budgets')
  ws.addRow(HEADERS).font = { bold: true }

  const lightBlueFill = {
    type: 'pattern' as const,
    pattern: 'solid' as const,
    fgColor: { argb: 'FFCCE5FF' }, // Light blue
  }
  const lightGreenFill = {
    type: 'pattern' as const,
    pattern: 'solid' as const,
    fgColor: { argb: 'FFD9F9D9' }, // Light green
  }
  const unitHeaderFill = {
    type: 'pattern' as const,
    pattern: 'solid' as const,
    fgColor: { argb: 'FFE6E6E6' }, // Light gray
  }

  // Group data by academic unit
  const groupedData = data.reduce(
    (acc, protocol) => {
      protocol.academicUnits.forEach((unitName) => {
        if (!acc[unitName]) {
          acc[unitName] = []
        }
        acc[unitName].push(protocol)
      })
      return acc
    },
    {} as Record<string, ProtocolData[]>
  )

  // Add data for each academic unit
  Object.entries(groupedData).forEach(([unitName, protocols]) => {
    // Add academic unit header
    const unitRow = ws.addRow([
      unitName,
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ])
    unitRow.eachCell((cell) => {
      cell.fill = unitHeaderFill
      cell.font = { bold: true }
    })

    protocols.forEach((protocol) => {
      protocol.teamMembers.forEach((member, i) => {
        const row = ws.addRow([
          i === 0 ? (member.protocolNumber ?? '') : '',
          i === 0 ? protocol.projectTitle : '',
          i === 0 ? protocol.yearWithDuration : '',
          i === 0 ?
            ProtocolStatesDictionary[
              protocol.state as keyof typeof ProtocolStatesDictionary
            ]
          : '',
          member.name,
          member.role ?? '',
          member.category,
          member.hoursAssigned,
          member.workingMonths,
          member.hourlyPrice,
          member.totalCost,
        ])
        row.eachCell((cell) => {
          cell.fill = lightBlueFill
        })
      })

      protocol.expenses?.forEach((expense) => {
        const row = ws.addRow([
          '', // Protocol Number
          '', // Project Title
          '', // Year and Duration
          '', // State
          expense.name, // Team Member Name
          'Gasto Directo', // Role
          '', // Category
          '', // Hours Assigned
          '', // Working Months
          '', // Hourly Price
          expense.amount, // Total Cost
        ])
        row.eachCell((cell) => {
          cell.fill = lightGreenFill
        })
      })

      // Add a thick black bottom border to the last row of this protocol
      if (ws.lastRow) {
        const lastRow = ws.getRow(ws.lastRow.number)
        lastRow.eachCell((cell) => {
          cell.border = {
            ...cell.border,
            bottom: { style: 'thin', color: { argb: 'FF000000' } },
          }
        })
      }
    })
  })

  // Set currency format for monetary columns (CLP format without decimals)
  ws.getColumn(10).numFmt = ws.getColumn(11).numFmt = '"$"#,##0;[Red]\-"$"#,##0'

  // Auto-fit columns for better readability
  ws.columns.forEach((column) => {
    column.width = 15
  })

  return wb.xlsx.writeBuffer()
}

const downloadBlob = (blob: Blob, filename: string) => {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const DownloadButton = ({
  label,
  onClick,
}: {
  label: string
  onClick: () => void | Promise<void>
}) => (
  <Button outline onClick={onClick}>
    {label}
  </Button>
)

export default function DownloadTabularData() {
  const { data } = useQuery({
    queryKey: ['anual-budget-years'],
    queryFn: async () => await getAnualBudgetYears(),
  })
  const years = Array.from(new Set(data?.map((y) => y.year.toString()) ?? []))
  const maxYear =
    years.length > 0 ? Math.max(...years.map(Number)) : new Date().getFullYear()
  if (!years.includes((maxYear + 1).toString()))
    years.push((maxYear + 1).toString())
  years.sort((a, b) => b.localeCompare(a))
  const [selectedYear, setSelectedYear] = useState<string>(years[0] ?? '')
  const [open, setOpen] = useState(false)

  const handleCSV = async () => {
    try {
      const data = await getProtocolBudgetData(selectedYear)
      const csv = generateCSV(data)
      downloadBlob(
        new Blob([csv], { type: 'text/csv;charset=utf-8;' }),
        `protocol_budgets_${selectedYear}.csv`
      )
      setOpen(false)
    } catch (e) {
      console.error('Error generating CSV:', e)
    }
  }

  const handleXLSX = async () => {
    try {
      const data = await getProtocolBudgetData(selectedYear)
      const buffer = await generateXLSX(data)
      downloadBlob(
        new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }),
        `protocol_budgets_${selectedYear}.xlsx`
      )
      setOpen(false)
    } catch (e) {
      console.error('Error generating XLSX:', e)
    }
  }

  return (
    <>
      <Button outline onClick={() => setOpen(true)}>
        <Download data-slot="icon" /> Descargar datos tabulares
      </Button>
      <Dialog open={open} onClose={() => setOpen(false)} size="sm">
        <DialogTitle>Descargar datos tabulares</DialogTitle>
        <DialogBody>
          <div className="mb-2 flex items-center gap-2">
            <label htmlFor="year-select">Año:</label>
            <select
              id="year-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="rounded border px-2 py-1"
            >
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </DialogBody>
        <DialogActions>
          <DownloadButton label="Descargar CSV" onClick={handleCSV} />
          <DownloadButton label="Descargar Excel" onClick={handleXLSX} />
        </DialogActions>
      </Dialog>
    </>
  )
}
