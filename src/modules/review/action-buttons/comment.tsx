'use client'
import { Button } from '@elements/Button'
import { canExecute } from '@utils/scopes'
import { ACTION, RoleType, StateType } from '@utils/zod'

type ActionButtonTypes = {
    role: RoleType
    protocolId: string
    protocolState: StateType
    commentState: Boolean
    action: Function
}

export default function CommentButton({
    role,
    protocolId,
    protocolState,
    commentState,
    action,
}: ActionButtonTypes) {
    // if (canExecute(ACTION.COMMENT, "METHODOLOGIST", "METHOD"))
    //     return <Button onClick={()=>{
    //         action()
    //     }} className='w-full my-2' intent={'primary'}>{commentState ? "Cerrar" : "Crear comentario"}</Button>

    if (canExecute(ACTION.COMMENT, role, protocolState))
        return (
            <Button className="w-full" intent={'primary'}>
                Crear comentario
            </Button>
        )
    return <></>
}
