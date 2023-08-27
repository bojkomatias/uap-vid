import type { RoleType, StateType, ActionType, AccessType } from './zod'
import { ROLE, STATE, ACTION, ACCESS } from './zod'

// This component is meant to export helper functionalities in a centralized matter when we come to roles or states.
// Atomic SRP Components that operate with one of these actions, should be guarded by this functions.
// Check if role its allowed access or action

/** Role Access Scope
 * - Check access to resource according to user role
 */
const ROLE_ACCESS: { [key in keyof typeof ROLE]: AccessType[] } = {
    [ROLE.RESEARCHER]: [ACCESS.PROTOCOLS, ACCESS.REVIEWS],
    [ROLE.SECRETARY]: [ACCESS.PROTOCOLS, ACCESS.REVIEWS],
    [ROLE.METHODOLOGIST]: [ACCESS.PROTOCOLS],
    [ROLE.SCIENTIST]: [ACCESS.PROTOCOLS],
    [ROLE.ADMIN]: [
        ACCESS.PROTOCOLS,
        ACCESS.CONVOCATORIES,
        ACCESS.REVIEWS,
        ACCESS.USERS,
        ACCESS.ACADEMIC_UNITS,
        ACCESS.TEAM_MEMBERS,
        ACCESS.MEMBER_CATEGORIES,
    ],
}

/** Role Action Scope
 * - Check if action can be performed according to user role
 */
const ROLE_SCOPE: { [key in keyof typeof ROLE]: ActionType[] } = {
    [ROLE.RESEARCHER]: [ACTION.CREATE, ACTION.EDIT_BY_OWNER],
    [ROLE.SECRETARY]: [
        ACTION.ACCEPT,
        ACTION.CREATE,
        ACTION.EDIT,
        ACTION.EDIT_BY_OWNER,
    ],
    [ROLE.METHODOLOGIST]: [ACTION.REVIEW, ACTION.CREATE, ACTION.EDIT_BY_OWNER],
    [ROLE.SCIENTIST]: [ACTION.REVIEW],
    [ROLE.ADMIN]: [
        ACTION.CREATE,
        ACTION.EDIT,
        ACTION.EDIT_BY_OWNER,
        ACTION.ACCEPT,
        ACTION.REVIEW,
        ACTION.APPROVE,
        ACTION.ASSIGN_TO_METHODOLOGIST,
        ACTION.ASSIGN_TO_SCIENTIFIC,
    ],
}

/** State Action Scope
 * - Check if an action can be performed according current protocol state
 */
const STATE_SCOPE: { [key in keyof typeof STATE]: ActionType[] } = {
    [STATE.NOT_CREATED]: [ACTION.CREATE],
    [STATE.DRAFT]: [ACTION.EDIT_BY_OWNER],
    [STATE.PUBLISHED]: [ACTION.ASSIGN_TO_METHODOLOGIST, ACTION.EDIT],
    [STATE.METHODOLOGICAL_EVALUATION]: [
        ACTION.EDIT_BY_OWNER,
        ACTION.REVIEW,
        ACTION.ASSIGN_TO_SCIENTIFIC,
    ],
    [STATE.SCIENTIFIC_EVALUATION]: [
        ACTION.EDIT_BY_OWNER,
        ACTION.REVIEW,
        ACTION.ACCEPT,
    ],
    [STATE.ACCEPTED]: [ACTION.APPROVE],
    [STATE.ON_GOING]: [],
    [STATE.FINISHED]: [],
    [STATE.DISCONTINUED]: [],
    [STATE.DELETED]: [],
}

/**
 * Check Access to resource by current user role
 * @param access
 * @param role
 * @returns
 */
export const canAccess = (access: AccessType, role: RoleType) =>
    ROLE_ACCESS[role].includes(access)

/**
 * Check Execution Permission according to State and Role
 * @param action
 * @param role
 * @param state
 * @returns
 */
export const canExecute = (
    action: ActionType,
    role: RoleType,
    state: StateType
) => ROLE_SCOPE[role].includes(action) && STATE_SCOPE[state].includes(action)

export const canExecuteActions = (
    actions: ActionType[],
    role: RoleType,
    state: StateType
) =>
    actions.some((a) => ROLE_SCOPE[role].includes(a)) &&
    actions.some((a) => STATE_SCOPE[state].includes(a))
