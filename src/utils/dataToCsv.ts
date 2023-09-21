import type { ColumnDef } from '@tanstack/react-table'
/**This helper is basically a formatter which takes the columns and data of the table and returns them in a format that can be directly downloaded as a CSV file
 * @param columns - the columns defined for the TanStack table.
 * @param data - the data passed to the TanStack table.
 */

const usersData = [
    {
        id: 1,
        name: 'Leanne Graham',
        username: 'Bret',
        email: 'Sincere@april.biz',
        phone: '1-770-736-8031 x56442',
        website: 'hildegard.org',
    },
    {
        id: 2,
        name: 'Ervin Howell',
        username: 'Antonette',
        email: 'Shanna@melissa.tv',
        phone: '010-692-6593 x09125',
        website: 'anastasia.net',
    },
    {
        id: 3,
        name: 'Clementine Bauch',
        username: 'Samantha',
        email: 'Nathan@yesenia.net',
        phone: '1-463-123-4447',
        website: 'ramiro.info',
    },
    {
        id: 4,
        name: 'Patricia Lebsack',
        username: 'Karianne',
        email: 'Julianne.OConner@kory.org',
        phone: '493-170-9623 x156',
        website: 'kale.biz',
    },
    {
        id: 5,
        name: 'Chelsey Dietrich',
        username: 'Kamren',
        email: 'Lucio_Hettinger@annie.ca',
        phone: '(254)954-1289',
        website: 'demarco.info',
    },
]

const csvData = [
    ['ID', 'Name', 'Username', 'Email', 'Phone', 'Website'],
    ...usersData.map(({ id, name, username, email, phone, website }) => [
        id,
        name,
        username,
        email,
        phone,
        website,
    ]),
]

export default function dataToCsv(
    columns: ColumnDef<any, unknown>[],
    data: unknown[]
) {
    const columnsToExport = columns
        .map((c: any) => c.accessorKey)
        .filter(
            (accessorKey) =>
                //Remove self-indicator and actions keys, which are not useful for a spreadsheet, and also remove the undefined (at least for now).
                accessorKey !== 'self-indicator' &&
                accessorKey !== 'actions' &&
                accessorKey
        )

    const extractedData = () => {
        const results: any[] = []

        data.forEach((d) => {
            const rowData: any = {} // Create an object for each row of data

            columnsToExport.forEach((c) => {
                const object = d // Use the current data row
                const nestedKeyString = c

                const keys = nestedKeyString.split('.')
                let result: any = object
                for (const key of keys) {
                    if (object) result = result[key]
                }

                // Assign the extracted data to the corresponding key in the row object
                rowData[c] = JSON.stringify(result)
            })

            results.push(rowData) // Push the row object to the results array
        })

        return results.map((r) => Object.values(r))
    }

    console.log('AAAAAAAAAAA', [columnsToExport, ...extractedData()])

    console.log('USERS DATA', csvData)

    return [columnsToExport, ...extractedData()]
}
