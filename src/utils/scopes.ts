import type { RoleType, StateType, ActionType, AccessType } from './zod'
import { ROLE, STATE, ACTION, ACCESS } from './zod'

// This component is meant to export helper functionalities in a centralized matter when we come to roles or states.
// Atomic SRP Components that operate with one of these actions, should be guarded by this functions.
// Check if role its allowed

// ACCESS.PROTOCOLS and ACTION.VIEW removed cause everyone can
const ROLE_SCOPE = {
    [ROLE.RESEARCHER]: [
        ACCESS.PROTOCOLS,
        ACCESS.REVIEWS,
        ACTION.CREATE,
        ACTION.EDIT_BY_OWNER,
    ],
    [ROLE.SECRETARY]: [
        ACCESS.PROTOCOLS,
        ACCESS.REVIEWS,
        ACTION.ACCEPT,
        ACTION.CREATE,
        ACTION.EDIT,
        ACTION.EDIT_BY_OWNER,
    ],
    [ROLE.METHODOLOGIST]: [
        ACCESS.PROTOCOLS,
        ACTION.COMMENT,
        ACTION.CREATE,
        ACTION.EDIT_BY_OWNER,
    ],
    [ROLE.SCIENTIST]: [ACCESS.PROTOCOLS, ACTION.COMMENT],
    [ROLE.ADMIN]: [
        ACCESS.PROTOCOLS,
        ACCESS.CONVOCATORIES,
        ACCESS.REVIEWS,
        ACCESS.USERS,
        ACCESS.ACADEMIC_UNITS,
        ACCESS.MEMBER_CATEGORIES,
        ACTION.CREATE,
        ACTION.EDIT,
        ACTION.EDIT_BY_OWNER,
        ACTION.ACCEPT,
        ACTION.COMMENT,
        ACTION.APPROVE,
        ACTION.ASSIGN_TO_METHODOLOGIST,
        ACTION.ASSIGN_TO_SCIENTIFIC,
    ],
}

// Check if state allows the action
const STATE_SCOPE = {
    [STATE.NOT_CREATED]: [ACTION.CREATE],
    [STATE.DRAFT]: [ACTION.EDIT_BY_OWNER],
    [STATE.PUBLISHED]: [ACTION.ASSIGN_TO_METHODOLOGIST, ACTION.EDIT],
    [STATE.METHODOLOGICAL_EVALUATION]: [
        ACTION.EDIT_BY_OWNER,
        ACTION.COMMENT,
        ACTION.ASSIGN_TO_SCIENTIFIC,
    ],
    [STATE.SCIENTIFIC_EVALUATION]: [
        ACTION.EDIT_BY_OWNER,
        ACTION.COMMENT,
        ACTION.ACCEPT,
    ],
    [STATE.ACCEPTED]: [ACTION.APPROVE],
    [STATE.ON_GOING]: [],
    [STATE.FINISHED]: [],
    [STATE.DISCONTINUED]: [],
    [STATE.DELETED]: [],
}

// ! Use to guard transitions
export function canExecute(
    action: ActionType,
    role: RoleType,
    state: StateType
) {
    if (!action || !role || !state) return false
    if (
        ROLE_SCOPE[role].some((a) => a === action) &&
        STATE_SCOPE[state].some((a) => a === action)
    )
        return true
    return false
}

export function canExecuteActions(
    actions: ActionType[],
    role: RoleType,
    state: StateType
) {
    if (!actions.length || !role || !state) return false
    if (
        ROLE_SCOPE[role].some((a) => a === actions.find((x) => x === a)) &&
        STATE_SCOPE[state].some((a) => a === actions.find((x) => x === a))
    )
        return true
    return false
}

// * Use when multiple protocols are involved so you can't pin point state (eg. Access to table, or to columns)
export function canAccess(access: AccessType, role: RoleType) {
    if (!access || !role) return false
    if (ROLE_SCOPE[role].some((a) => a === access)) return true
    return false
}
