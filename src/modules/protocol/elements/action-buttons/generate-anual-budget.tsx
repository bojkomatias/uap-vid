'use client'
import { buttonStyle } from '@elements/button/styles'
import type { Protocol, Review, State, User } from '@prisma/client'
import { canExecute } from '@utils/scopes'
import { ACTION } from '@utils/zod'
import Link from 'next/link'
import { FileDollar } from 'tabler-icons-react'
import { useDisclosure } from '@mantine/hooks'
import { Modal, Group } from '@mantine/core'
import { Button } from '@elements/button'

type ActionButtonTypes = {
    user: User
    protocol: Protocol
    reviews: Review[]
}

export default function GenerateAnualBudgetButton({
    user,
    protocol,
    reviews,
}: ActionButtonTypes) {
    const [opened, { open, close }] = useDisclosure(false)
    return (
        <>
            <Modal
                className="w-[70vw]"
                opened={opened}
                onClose={close}
                title="Previsualización del presupuesto anual"
            >
                {JSON.stringify(protocol.sections.budget, null, 1)}
                <Button intent="secondary">Generar presupuesto</Button>
            </Modal>

            <Group position="center">
                <Button intent="secondary" onClick={open}>
                    <FileDollar />
                    Generar presupuesto
                </Button>
            </Group>
        </>
    )
}
