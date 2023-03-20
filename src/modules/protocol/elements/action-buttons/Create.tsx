'use client'
import { Button } from '@elements/Button'
import { canExecute } from '@utils/scopes'
import { ACTION, RoleType, StateType } from '@utils/zod'
import Link from 'next/link'
import { FilePlus } from 'tabler-icons-react'

type ActionButtonTypes = { role: RoleType }

export default function CreateButton(props: ActionButtonTypes) {
    if (canExecute(ACTION.EDIT, props.role, 'NOT_CREATED'))
        return (
            <Button intent={'secondary'}>
                <Link href={'/protected/protocol/new'} passHref>
                    <FilePlus className="mr-3 h-5" /> Nueva Postulación
                </Link>
            </Button>
        )
    return <></>
}
