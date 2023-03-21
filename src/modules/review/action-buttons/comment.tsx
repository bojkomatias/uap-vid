'use client'
import { Button } from '@elements/Button'
import { protocol } from '@prisma/client'
import { canExecute } from '@utils/scopes'
import { ACTION, RoleType } from '@utils/zod'


type ActionButtonTypes = { role: RoleType; protocol: protocol, commentState: Boolean, action: Function }



export default function CommentButton({ role, protocol, commentState, action }: ActionButtonTypes) {

    // if (canExecute(ACTION.COMMENT, "METHODOLOGIST", "METHOD"))
    //     return <Button onClick={()=>{
    //         action()
    //     }} className='w-full my-2' intent={'primary'}>{commentState ? "Cerrar" : "Crear comentario"}</Button>
    
    if (canExecute(ACTION.COMMENT, role, protocol.state))
        return <Button  className='w-full' intent={'primary'}>Crear comentario</Button>
    return <></>
}
