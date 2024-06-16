/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from '@components/button'
import type { ColumnDef } from '@tanstack/react-table'
import dataToCsv from '@utils/dataToCsv'
import React, { useMemo, useState } from 'react'
import { CSVDownload } from 'react-csv'
import { FileDownload } from 'tabler-icons-react'

export default function DownloadCSVButton({
  totalRecordsCheck,
  data,
  columns,
}: {
  totalRecordsCheck: boolean
  data: unknown[]
  columns: ColumnDef<any, unknown>[]
}) {
  const [download, setDownload] = useState(false)

  return (
    <div className="group relative">
      {/*Tried using Tooltip component but couldn't make it work as intended, so I copied the styles from the tooltip to mantain the style */}
      {totalRecordsCheck && (
        <div className="pointer-events-none absolute bottom-8 left-0 z-20 bg-white text-xs text-gray-500 opacity-0 transition delay-300 group-hover:pointer-events-auto group-hover:opacity-100">
          <div className="prose prose-zinc prose-p:pl-2 inset-auto mt-2 cursor-default rounded border p-3 px-3 py-2 text-xs shadow-md ring-inset ">
            Para descargar la hoja de datos debe mostrar{' '}
            <span
              className="font-bold transition hover:text-gray-700"
              onMouseEnter={() => {
                document
                  .getElementById('records-selector')
                  ?.classList.add('animate-pulse')
                setTimeout(() => {
                  document
                    .getElementById('records-selector')
                    ?.classList.remove('animate-pulse')
                }, 1800)
              }}
              onClick={() => {
                document.getElementById('records-selector')?.click()
              }}
            >
              todos los registros
            </span>
          </div>
        </div>
      )}
      <Button
        disabled={totalRecordsCheck}
        onClick={() => {
          setDownload(true)
          setTimeout(() => {
            setDownload(false)
          }, 1000)
        }}
        plain
      >
        <FileDownload data-slot="icon" />
        Descargar datos
      </Button>
      {download ?
        <Download data={data} columns={columns} />
      : null}
    </div>
  )
}

function Download({
  data,
  columns,
}: {
  data: unknown[]
  columns: ColumnDef<any, unknown>[]
}) {
  const CSVData = useMemo(() => dataToCsv(columns, data), [columns, data])
  return <CSVDownload data={CSVData} target="_blank" />
}
