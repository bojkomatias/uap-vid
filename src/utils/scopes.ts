import { getServerSession } from 'next-auth'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import {
    ROLE,
    RoleType,
    STATE,
    StateType,
    ACTION,
    ActionType,
    ACCESS,
    AccessType,
} from './zod'

// This component is meant to export helper functionalities in a centralized matter when we come to roles or states.
// Atomic SRP Components that operate with one of these actions, should be guarded by this functions.
// Check if role its allowed
const ROLE_SCOPE = {
    [ROLE.RESEARCHER]: [
        ACCESS.PROTOCOLS,
        ACTION.PUBLISH,
        ACTION.CREATE,
        ACTION.EDIT,
        ACTION.VIEW,
    ],
    [ROLE.SECRETARY]: [ACTION.ACCEPT, ACTION.VIEW],
    [ROLE.METHODOLOGIST]: [ACTION.VIEW, ACTION.COMMENT],
    [ROLE.EVALUATOR]: [ACTION.VIEW, ACTION.COMMENT],
    [ROLE.ADMIN]: [
        ACCESS.PROTOCOLS,
        ACCESS.USERS,
        ACTION.CREATE,
        ACTION.VIEW,
        ACTION.EDIT,
        ACTION.ACCEPT,
        ACTION.PUBLISH,
        ACTION.COMMENT,
    ],
}

// Check if state allows the action
const STATE_SCOPE = {
    [STATE.NOT_CREATED]: [ACTION.CREATE],
    [STATE.DRAFT]: [ACTION.PUBLISH, ACTION.EDIT],
    [STATE.METHOD]: [ACTION.COMMENT, ACTION.VIEW],
    [STATE.SCIENTIFIC]: [ACTION.COMMENT, ACTION.VIEW, ACTION.ACCEPT],
    [STATE.ACCEPTED]: [ACTION.VIEW],
    [STATE.ONGOING]: [ACTION.VIEW],
}

// ! Use to guard transitions
export function canExecute(
    action: ActionType,
    role: RoleType,
    state: StateType
) {
    if (
        ROLE_SCOPE[role].some((a) => a === action) &&
        STATE_SCOPE[state].some((a) => a === action)
    )
        return true
    return false
}

// * Use when multiple protocols are involved so you can't pin point state (eg. Access to table, or to columns)
export function canAccess(access: AccessType, role: RoleType) {
    if (ROLE_SCOPE[role].some((a) => a === access)) return true
    return false
}
