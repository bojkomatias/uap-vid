/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useRef, useEffect } from 'react'
import jspreadsheet from 'jspreadsheet'
import render from '@jspreadsheet/render'
import '/node_modules/jspreadsheet/dist/jspreadsheet.css'
import '/node_modules/jsuites/dist/jsuites.css'
import { Button } from '@elements/button'
import type { Protocol } from '@prisma/client'

const download = function (e: HTMLElement) {
    // The method should receive the spreadsheet DOM element
    jspreadsheet.render(e, {})
}

export default function ProtocolCsv({
    protocols,
}: {
    protocols: Protocol[] | null
}) {
    const jssRef = useRef(null)
    const spreadsheet = useRef(null)

    jspreadsheet.setLicense(
        'ZTYyMTQ4MjY3MTAwYjFhOTBmMjIwY2UwYTdjMWIyZTczYWQ4MWFlYzFkYzZlNDYzZWY0ZTExOWE0Mjg4NmIyNTI1ZWU2ZmVmZDgwMjU4NDVhNGYxY2U4ZjYzZGZjNGU3OGRjNjA3NjdkNDVmZTUyMjkwOTlkM2ViY2M2NTQ0MjksZXlKdVlXMWxJam9pU25Od2NtVmhaSE5vWldWMElpd2laR0YwWlNJNk1UWTVOVGMyT1RJd01Dd2laRzl0WVdsdUlqcGJJbXB6YUdWc2JDNXVaWFFpTENKcWMzQnlaV0ZrYzJobFpYUXVZMjl0SWl3aVkzTmlMbUZ3Y0NJc0luTmhiM0p2WTJzdVkyOXRJaXdpZFdVdVkyOXRMbUp5SWl3aWRXNXBkR1ZrTG1Wa2RXTmhkR2x2YmlJc0ltTnZaR1Z6WVc1a1ltOTRMbWx2SWl3aWJHOWpZV3hvYjNOMElsMHNJbkJzWVc0aU9pSXpNU0lzSW5OamIzQmxJanBiSW5ZM0lpd2lkamdpTENKMk9TSXNJbVp2Y20xeklpd2labTl5YlhWc1lTSXNJbkpsYm1SbGNpSXNJbkJoY25ObGNpSXNJbWx0Y0c5eWRHVnlJaXdpZG1Gc2FXUmhkR2x2Ym5NaUxDSmpiMjF0Wlc1MGN5SXNJbk5sWVhKamFDSXNJbU5vWVhKMGN5SXNJbU5zYjNWa0lpd2lZbUZ5SWl3aWNISnBiblFpTENKdFlYTnJJaXdpYzJobFpYUnpJbDE5'
    )
    jspreadsheet.setExtensions({ render })

    useEffect(() => {
        // Create only once

        const protocolData = protocols?.map((protocol) => {
            return [
                protocol.id,
                protocol.sections.identification.title,
                protocol.sections.identification.team.map((member) => {
                    return [
                        ` ${member.name} ${member.last_name} ${member.role}, Horas: ${member.hours}`,
                    ]
                }),
                protocol.sections.budget.expenses.reduce((acc, val) => {
                    return (
                        acc +
                        val.data.reduce((prev, curr) => {
                            return prev + curr.amount
                        }, 0)
                    )
                }, 0),
            ]
        })

        if (!(jssRef.current as any | undefined).jspreadsheet) {
            (spreadsheet.current as any | undefined) = jspreadsheet(
                jssRef.current as any | undefined,
                {
                    worksheets: [
                        {
                            minDimensions: [4, protocols!.length],
                            columns: [
                                {
                                    title: 'Identificador',
                                    width: 200,
                                },
                                {
                                    title: 'Título',
                                    width: 200,
                                },
                                {
                                    title: 'Integrantes',
                                    width: 200,
                                },
                                {
                                    title: 'Presupuesto',
                                    type: 'numeric',
                                    mask: '$#.##0,00',
                                    width: 200,
                                },
                            ],

                            data: [...(protocolData as Array<any>)],
                        },
                    ],
                }
            )
        }
    }, [protocols])

    return (
        <>
            {' '}
            <div className=" hidden w-full justify-center">
                <div className="" ref={jssRef as any | undefined} />
                <br />
            </div>
            <Button onClick={() => download(jssRef.current as any | undefined)}>
                Descargar datos{' '}
            </Button>
        </>
    )
}
