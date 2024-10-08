import type { RoleType, StateType, ActionType, AccessType } from './zod'
import { ROLE, STATE, ACTION, ACCESS } from './zod'

// This component is meant to export helper functionalities in a centralized matter when we come to roles or states.
// Atomic SRP Components that operate with one of these actions, should be guarded by this functions.
// Check if role its allowed access or action

/** Role Access Scope
 * - Check access to resource according to user role
 */
const ROLE_ACCESS: { [key in keyof typeof ROLE]: AccessType[] } = {
  [ROLE.RESEARCHER]: [ACCESS.PROTOCOLS, ACCESS.REVIEWS, ACCESS.USERS],
  [ROLE.SECRETARY]: [
    ACCESS.PROTOCOLS,
    ACCESS.REVIEWS,
    ACCESS.EVALUATORS,
    ACCESS.USERS,
  ],
  [ROLE.METHODOLOGIST]: [ACCESS.PROTOCOLS, ACCESS.USERS],
  [ROLE.SCIENTIST]: [ACCESS.PROTOCOLS, ACCESS.USERS],
  [ROLE.ADMIN]: [
    ACCESS.PROTOCOLS,
    ACCESS.CONVOCATORIES,
    ACCESS.REVIEWS,
    ACCESS.EVALUATORS,
    ACCESS.USERS,
    ACCESS.ACADEMIC_UNITS,
    ACCESS.TEAM_MEMBERS,
    ACCESS.MEMBER_CATEGORIES,
    ACCESS.ANUAL_BUDGETS,
  ],
}

/** Role Action Scope
 * - Check if action can be performed according to user role
 * - EDIT_BY_OWNER & PUBLISH can only be done for users that are protocol owners.
 */
const ROLE_SCOPE: { [key in keyof typeof ROLE]: ActionType[] } = {
  [ROLE.RESEARCHER]: [
    ACTION.CREATE,
    ACTION.EDIT_BY_OWNER,
    ACTION.PUBLISH,
    ACTION.VIEW_ANUAL_BUDGET,
  ],
  [ROLE.SECRETARY]: [
    ACTION.ACCEPT,
    ACTION.CREATE,
    ACTION.EDIT,
    ACTION.EDIT_BY_OWNER,
    ACTION.PUBLISH,
    ACTION.VIEW_ANUAL_BUDGET,
    ACTION.ASSIGN_TO_METHODOLOGIST,
    ACTION.ASSIGN_TO_SCIENTIFIC
  ],
  [ROLE.METHODOLOGIST]: [
    ACTION.REVIEW,
    ACTION.CREATE,
    ACTION.EDIT_BY_OWNER,
    ACTION.PUBLISH,
  ],
  [ROLE.SCIENTIST]: [ACTION.REVIEW],
  [ROLE.ADMIN]: [
    ACTION.CREATE,
    ACTION.EDIT,
    ACTION.EDIT_BY_OWNER,
    ACTION.PUBLISH,
    ACTION.ACCEPT,
    ACTION.REVIEW,
    ACTION.APPROVE,
    ACTION.ASSIGN_TO_METHODOLOGIST,
    ACTION.ASSIGN_TO_SCIENTIFIC,
    ACTION.DELETE,
    ACTION.DISCONTINUE,
    ACTION.FINISH,
    ACTION.VIEW_ANUAL_BUDGET,
    ACTION.GENERATE_ANUAL_BUDGET,
  ],
}

/** State Action Scope
 * - Check if an action can be performed according current protocol state
 */
const STATE_SCOPE: { [key in keyof typeof STATE]: ActionType[] } = {
  [STATE.NOT_CREATED]: [ACTION.CREATE],
  [STATE.DRAFT]: [ACTION.EDIT_BY_OWNER, ACTION.PUBLISH, ACTION.DELETE],
  [STATE.PUBLISHED]: [
    ACTION.ASSIGN_TO_METHODOLOGIST,
    ACTION.EDIT,
    ACTION.DISCONTINUE,
    ACTION.DELETE,
  ],
  [STATE.METHODOLOGICAL_EVALUATION]: [
    ACTION.ASSIGN_TO_METHODOLOGIST, // It's a Re-assignation
    ACTION.EDIT_BY_OWNER,
    ACTION.REVIEW,
    ACTION.ASSIGN_TO_SCIENTIFIC,
    ACTION.DISCONTINUE,
  ],
  [STATE.SCIENTIFIC_EVALUATION]: [
    ACTION.ASSIGN_TO_SCIENTIFIC, // Allows re-assignation
    ACTION.EDIT_BY_OWNER,
    ACTION.REVIEW,
    ACTION.ACCEPT,
    ACTION.DISCONTINUE,
  ],
  [STATE.ACCEPTED]: [
    ACTION.APPROVE,
    ACTION.DISCONTINUE,
    ACTION.EDIT,
    ACTION.GENERATE_ANUAL_BUDGET,
    ACTION.VIEW_ANUAL_BUDGET,
  ],
  [STATE.ON_GOING]: [
    ACTION.FINISH,
    ACTION.VIEW_ANUAL_BUDGET,
    ACTION.GENERATE_ANUAL_BUDGET,
  ],
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
