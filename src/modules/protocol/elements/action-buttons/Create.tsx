'use client'
import { Button } from '@elements/Button'
import { canExecute } from '@utils/scopes'
import { ACTION, RoleType, StateType } from '@utils/zod'
import Link from 'next/link'
import { FilePlus } from 'tabler-icons-react'

type ActionButtonTypes = { role: RoleType }

export default function CreateButton(props: ActionButtonTypes) {
    if (canExecute(ACTION.CREATE, props.role, 'NOT_CREATED'))
        return (
            <Link href={'/protocols/new'} passHref>
                <Button intent={'terciary'}>
                    <FilePlus className="mr-3 h-5" /> Nueva Postulación
                </Button>
            </Link>
        )
    return <></>
}
