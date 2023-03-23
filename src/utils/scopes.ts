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

// ACCESS.PROTOCOLS and ACTION.VIEW removed cause everyone can
const ROLE_SCOPE = {
    [ROLE.RESEARCHER]: [
        ACCESS.REVIEWS,
        ACTION.PUBLISH,
        ACTION.CREATE,
        ACTION.EDIT,
    ],
    [ROLE.SECRETARY]: [ACCESS.REVIEWS, ACTION.ACCEPT],
    [ROLE.METHODOLOGIST]: [ACTION.COMMENT],
    [ROLE.SCIENTIST]: [ACTION.COMMENT],
    [ROLE.ADMIN]: [
        ACCESS.CONVOCATORIES,
        ACCESS.REVIEWS,
        ACCESS.USERS,
        ACTION.CREATE,
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
    [STATE.PUBLISHED]: [ACTION.ASSIGN_TO_METHODOLOGIST],
    [STATE.METHODOLOGICAL_EVALUATION]: [
        ACTION.EDIT,
        ACTION.COMMENT,
        ACTION.ASSIGN_TO_SCIENTIFIC,
    ],
    [STATE.SCIENTIFIC_EVALUATION]: [ACTION.EDIT, ACTION.COMMENT, ACTION.ACCEPT],
    [STATE.ACCEPTED]: [ACTION.APPROVE],
    [STATE.ON_GOING]: [],
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

// * Use when multiple protocols are involved so you can't pin point state (eg. Access to table, or to columns)
export function canAccess(access: AccessType, role: RoleType) {
    if (!access || !role) return false
    if (ROLE_SCOPE[role].some((a) => a === access)) return true
    return false
}
