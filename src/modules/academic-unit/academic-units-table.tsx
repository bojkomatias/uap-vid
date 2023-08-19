import type { AcademicUnit } from '@prisma/client'
import { SecretaryMultipleSelect } from './secretary-multiple-select'
import { getAllSecretaries } from '@repositories/user'

export default async function AcademicUnitsTable({
    academicUnits,
}: {
    academicUnits: AcademicUnit[]
}) {
    const secretaries = await getAllSecretaries()
    if (!secretaries)
        return <div>No hay secretarios cargados en el sistema</div>

    return (
        <div className="mx-auto max-w-7xl">
            <table className="-mx-4 mt-8 min-w-full divide-y-2 sm:-mx-0">
                <thead>
                    <tr>
                        <th
                            scope="col"
                            className="py-3.5 pl-4 pr-3 text-left text-sm text-gray-900 sm:pl-0"
                        >
                            Unidad Académica
                        </th>
                        <th
                            scope="col"
                            className="max-w-md px-3 py-3.5 text-left text-sm text-gray-900"
                        >
                            Secretarios/as
                        </th>
                        <th
                            scope="col"
                            className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                        >
                            <span className="sr-only">Edit</span>
                        </th>
                    </tr>
                </thead>
                <tbody className="divide-y  bg-white">
                    {academicUnits?.map((unit) => (
                        <tr key={unit.id}>
                            <td className="w-full max-w-0 py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:w-auto sm:max-w-none sm:pl-0">
                                {unit.name}
                            </td>

                            <td className="w-1/2 px-3 py-2 text-sm text-gray-500">
                                <SecretaryMultipleSelect
                                    currentSecretaries={unit.secretariesIds}
                                    secretaries={secretaries}
                                    unitId={unit.id}
                                />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
