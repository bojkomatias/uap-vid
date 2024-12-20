/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ColumnDef } from '@tanstack/react-table'
/**This helper is basically a formatter which takes the columns and data of the table and returns them in a format that can be directly downloaded as a CSV file
 * @param columns - the columns defined for the TanStack table.
 * @param data - the data passed to the TanStack table.
 */

export default function dataToCsv(
  columns: ColumnDef<any, unknown>[],
  data: unknown[]
) {
  const columnsToExport = columns
    .map((c: any) => {
      return { accessorKey: c.accessorKey, label: c.header }
    })
    .filter(
      ({ accessorKey }) =>
        //Remove self-indicator and actions keys, which are not useful for a spreadsheet, and also remove the undefined (at least for now).
        accessorKey !== 'self-indicator' &&
        accessorKey !== 'logs' &&
        accessorKey !== 'actions' &&
        accessorKey !== 'password' &&
        accessorKey
    )

  const extractedData = () => {
    const results: any[] = []

    data?.forEach((d) => {
      const rowData: any = {} // Create an object for each row of data

      columnsToExport.forEach((c) => {
        const object = d // Use the current data row
        const nestedKeyString = c.accessorKey

        const keys = nestedKeyString.split('.')
        let result: any = object
        for (const key of keys) {
          // Check if result is null or undefined before going deeper (instead of object)
          if (result) result = result[key]
        }
        // Assign the extracted data to the corresponding key in the row object
        rowData[c.accessorKey] = result?.toString()
      })
      results.push(rowData) // Push the row object to the results array
    })

    return results.map((r) => Object.values(r))
  }

  return [columnsToExport.map((e) => e.label), ...extractedData()]
}
