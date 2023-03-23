import { User } from '@prisma/client'
import { canExecute } from '@utils/scopes'
import { ACTION, StateType } from '@utils/zod'
import ReviewForm from './Form'

// * Component acts as guard clause before rendering form.
export default function ReviewCreation({
    reviewer,
    protocolState,
}: {
    reviewer: User
    protocolState: StateType
}) {
    if (!canExecute(ACTION.COMMENT, reviewer.role, protocolState)) return <></>
    return <ReviewForm reviewer={reviewer} />
}
