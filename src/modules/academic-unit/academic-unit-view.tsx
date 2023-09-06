'use client'
import { useDisclosure } from '@mantine/hooks'
import { Drawer, Group } from '@mantine/core'
import type { AcademicUnit } from '@prisma/client'
import { Button } from '@elements/button'
import { Badge } from '@elements/badge'
import { formatCurrency } from '@utils/formatters'
import Currency from '@elements/currency'

export default function AcademicUnitView({
    academicUnit,
    children,
}: {
    academicUnit: AcademicUnit
    children: React.ReactNode
}) {
    const [opened, { open, close }] = useDisclosure(false)

    return (
        <>
            <Drawer
                className="absolute "
                position="right"
                opened={opened}
                onClose={close}
            >
                <section className="flex flex-col gap-4">
                    <div className="flex flex-col gap-3 rounded-md bg-gray-50 p-6 shadow-md">
                        <div className="flex  items-center gap-1">
                            <Badge className="text-sm">
                                {academicUnit.name}
                            </Badge>
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="text-sm text-gray-600">
                                Presupuesto:
                            </p>
                            <Currency
                                amount={
                                    academicUnit.budgets[
                                        academicUnit.budgets.length - 1
                                    ]?.amount
                                }
                            />
                        </div>
                    </div>{' '}
                    <div className="flex flex-col gap-3 rounded-md bg-gray-50 p-6 shadow-md">
                        {children}
                    </div>
                </section>
            </Drawer>

            <Group position="center">
                <Button
                    id="historic-prices-id"
                    className="px-2.5 py-1 text-xs"
                    onClick={open}
                    intent="secondary"
                >
                    Editar
                </Button>
            </Group>
        </>
    )
}
