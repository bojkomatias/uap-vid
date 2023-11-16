/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnDef } from '@tanstack/react-table'
import dataToCsv from '@utils/dataToCsv'
import React, { useMemo, useState } from 'react'
import { CSVDownload } from 'react-csv'
import { Button } from './button'

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
                <div className="pointer-events-none absolute left-0 top-10  z-20 bg-white  text-xs text-gray-500 opacity-0 transition delay-300 group-hover:pointer-events-auto group-hover:opacity-100">
                    <div className="prose prose-zinc inset-auto mt-2  cursor-default  rounded  border p-3 px-3 py-2 text-xs shadow-md  ring-inset prose-p:pl-2 ">
                        Para descargar la hoja de datos, seleccione <br />
                        <span
                            className="font-bold transition hover:text-gray-700"
                            onMouseEnter={() => {
                                document
                                    .getElementById('records-selector')
                                    ?.classList.add('animate-ping')
                                setTimeout(() => {
                                    document
                                        .getElementById('records-selector')
                                        ?.classList.remove('animate-ping')
                                }, 1800)
                            }}
                            onClick={() => {
                                document
                                    .getElementById('records-selector')
                                    ?.click()
                            }}
                        >
                            Cantidad de registros: Todos los registros
                        </span>
                    </div>
                </div>
            )}
            <Button
                className="group z-10"
                disabled={totalRecordsCheck}
                intent="outline"
                onClick={() => {
                    setDownload(true)
                    setTimeout(() => {
                        setDownload(false)
                    }, 1000)
                }}
            >
                Descargar hoja de datos
            </Button>
            {download ? <Download data={data} columns={columns} /> : null}
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
