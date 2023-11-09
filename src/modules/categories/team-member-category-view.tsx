import type { TeamMemberCategory } from '@prisma/client'
import { Button } from '@elements/button'
import { Badge } from '@elements/badge'
import Currency from '@elements/currency'
import { currencyFormatter } from '@utils/formatters'
import CustomDrawer from '@elements/custom-drawer'

import { useState } from 'react'

export default function TeamMemberCategoryView({
    teamMemberCategory,
}: {
    teamMemberCategory: TeamMemberCategory
}) {
    const [opened, setOpened] = useState(false)

    return (
        <>
            <CustomDrawer
                title="Valores históricos de la categoría"
                open={opened}
                onClose={setOpened}
            >
                <section className="flex flex-col gap-4">
                    {' '}
                    <div className="flex flex-col gap-3 rounded-md bg-gray-50 px-4 py-3">
                        <div className="flex  items-center gap-1">
                            <p className="text-sm text-gray-600">Categoría:</p>
                            <Badge className="text-sm">
                                {teamMemberCategory.name}
                            </Badge>
                        </div>
                        <div className="flex  items-center gap-2">
                            <p className="text-sm text-gray-600">Valor hora:</p>
                            <Currency
                                amount={teamMemberCategory.price.at(-1)?.price}
                            />
                        </div>
                    </div>
                    <div className="flex flex-col gap-3 rounded-md bg-gray-50 px-4 py-3">
                        <p className="text-xs">Valores históricos:</p>
                        <table className="table-auto text-sm text-gray-600">
                            <thead>
                                <tr className="text-left ">
                                    <th className="font-semibold">
                                        Valor hora
                                    </th>
                                    <th className="font-semibold">Desde</th>
                                    <th className="font-semibold">Hasta</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teamMemberCategory.price
                                    .slice(
                                        0,
                                        teamMemberCategory.price.length - 1
                                    )
                                    .reverse()
                                    .map((price, idx) => {
                                        return (
                                            <>
                                                <tr key={idx}>
                                                    <td className="pt-2">
                                                        $
                                                        {currencyFormatter.format(
                                                            price.price
                                                        )}{' '}
                                                        {price.currency}
                                                    </td>
                                                    <td>
                                                        {price.from.toLocaleDateString()}
                                                    </td>
                                                    <td>
                                                        {price.to?.toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            </>
                                        )
                                    })}
                            </tbody>
                        </table>
                    </div>
                </section>
            </CustomDrawer>

            <Button
                className="px-2.5 py-1 text-xs"
                onClick={() => setOpened(true)}
                intent="secondary"
                size="xs"
            >
                Ver histórico
            </Button>
        </>
    )
}
