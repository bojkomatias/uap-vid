/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
//I couldn't implement this as a server side component, sadly.
import { Button } from '@elements/button'
import type { Protocol } from '@prisma/client'

export default function ProtocolCsv({
    protocols,
}: {
    protocols: Protocol[] | null
}) {
    if (!protocols) return null

    function downloadCSVFile(csv_data: any) {
        // Create CSV file object and feed our
        // csv_data into it
        const CSVFile = new Blob([csv_data], { type: 'text/csv' })

        // Create to temporary link to initiate
        // download process
        const temp_link = document.createElement('a')

        // Download csv file
        temp_link.download = 'GfG.csv'
        const url = window.URL.createObjectURL(CSVFile)
        temp_link.href = url

        // This link should not be displayed
        temp_link.style.display = 'none'
        document.body.appendChild(temp_link)

        // Automatically click the link to trigger download
        temp_link.click()
        document.body.removeChild(temp_link)
    }
    function tableToCSV() {
        // Variable to store the final csv data
        const csv_data = []

        // Get each row data
        const rows = document
            .getElementById('csv-table')!
            .getElementsByTagName('tr')
        for (let i = 0; i < rows.length; i++) {
            // Get each column data
            const cols = rows[i].querySelectorAll('td,th')

            // Stores each csv row data
            const csvrow = []
            for (let j = 0; j < cols.length; j++) {
                // Get the text data of each cell of
                // a row and push it to csvrow
                csvrow.push(cols[j].innerHTML)
            }

            // Combine each column value with comma
            csv_data.push(csvrow.join(','))
        }
        // combine each row data with new line character
        const c = csv_data.join('\n')

        downloadCSVFile(c)
    }

    console.log(JSON.stringify(protocols[0].sections.budget.expenses))

    return (
        <>
            <Button onClick={() => tableToCSV()}> Export excel </Button>

            <table id="csv-table" className="hidden">
                <tbody>
                    <tr>
                        <th>ProtocolID</th>
                        <th>Title</th>
                        <th>Team</th>
                        <th>-</th>
                        <th>-</th>
                        <th>-</th>
                        <th>Presupuesto</th>
                        {protocols[0].sections.budget.expenses
                            .map((e) => e.type)
                            .map(() => (
                                <>
                                    <th>-</th>
                                    <th>-</th>
                                    <th>-</th>
                                </>
                            ))}
                    </tr>
                    <tr>
                        <th>-</th>
                        <th>-</th>
                        <th>Role</th>
                        <th>Last Name</th>
                        <th>First Name</th>
                        <th>Hours</th>
                        {protocols[0].sections.budget.expenses
                            .map((e) => e.type)
                            .map((t) => (
                                <>
                                    <th>{t}</th>
                                    <th>-</th>
                                    <th>-</th>
                                </>
                            ))}
                    </tr>
                    <tr>
                        <th>-</th>
                        <th>-</th>
                        <th>-</th>
                        <th>-</th>
                        <th>-</th>
                        <th>-</th>
                        {protocols[0].sections.budget.expenses
                            .map((e) => e.type)
                            .map(() => (
                                <>
                                    <th>Detalle</th>
                                    <th>Monto</th>
                                    <th>Year</th>
                                </>
                            ))}
                    </tr>

                    {protocols.map((protocol) =>
                        protocol.sections.identification.team.map(
                            ({ role, last_name, name, hours }, index) => (
                                <tr key={protocol.id}>
                                    <td>{index === 0 ? protocol.id : null}</td>
                                    <td>
                                        {index === 0
                                            ? protocol.sections.identification
                                                  .title
                                            : null}
                                    </td>
                                    <td>{role}</td>
                                    <td>{last_name}</td>
                                    <td>{name}</td>
                                    <td>{hours}</td>
                                    {protocols[0].sections.budget.expenses
                                        .map((e) => e.type)
                                        .map((_, i) => (
                                            <>
                                                {protocol.sections.budget
                                                    .expenses[i].data[index] ? (
                                                    <>
                                                        <td>
                                                            {
                                                                protocol
                                                                    .sections
                                                                    .budget
                                                                    .expenses[i]
                                                                    .data[index]
                                                                    .detail
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                protocol
                                                                    .sections
                                                                    .budget
                                                                    .expenses[i]
                                                                    .data[index]
                                                                    .amount
                                                            }
                                                        </td>
                                                        <td>
                                                            {
                                                                protocol
                                                                    .sections
                                                                    .budget
                                                                    .expenses[i]
                                                                    .data[index]
                                                                    .year
                                                            }
                                                        </td>
                                                    </>
                                                ) : null}
                                            </>
                                        ))}
                                </tr>
                            )
                        )
                    )}
                </tbody>
            </table>
        </>
    )
}
