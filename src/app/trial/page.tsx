import {
    TableHead,
    TableRow,
    TableHeader,
    TableBody,
    TableCell,
    Table,
} from '@components/table'

const users = [{ name: 'matu', email: 'matubojko', role: 'Puto' }]

export default function Page() {
    return (
        <Table
            bleed
            className="[--gutter:theme(spacing.6)] sm:[--gutter:theme(spacing.8)]"
        >
            <TableHead>
                <TableRow>
                    <TableHeader>Name</TableHeader>
                    <TableHeader>Email</TableHeader>
                    <TableHeader>Role</TableHeader>
                </TableRow>
            </TableHead>
            <TableBody>
                {users.map((user) => (
                    <TableRow key={user.name}>
                        <TableCell className="font-medium">
                            {user.name}
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="text-zinc-500">
                            {user.role}
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}
