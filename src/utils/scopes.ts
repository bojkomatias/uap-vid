// This component is meant to export helper functionalities in a centralized matter when we come to roles or states.
// Atomic SRP Components that operate with one of these actions, should be guarded by this functions.
// Check if role its allowed access or action

import { Access, Action, ProtocolState, Role } from '@prisma/client'

/** Role Access Scope
 * - Check access to resource according to user role
 */
const Role_ACCESS: { [key in keyof typeof Role]: Access[] } = {
  [Role.RESEARCHER]: [Access.PROTOCOLS, Access.REVIEWS],
  [Role.SECRETARY]: [Access.PROTOCOLS, Access.REVIEWS, Access.EVALUATORS],
  [Role.METHODOLOGIST]: [Access.PROTOCOLS],
  [Role.SCIENTIST]: [Access.PROTOCOLS],
  [Role.ADMIN]: [
    Access.PROTOCOLS,
    Access.CONVOCATORIES,
    Access.REVIEWS,
    Access.EVALUATORS,
    Access.USERS,
    Access.ACADEMIC_UNITS,
    Access.TEAM_MEMBERS,
    Access.MEMBER_CATEGORIES,
    Access.ANUAL_BUDGETS,
    Access.INDEXES,
    Access.CAREERS,
    Access.EVALUATIONS,
    Access.EMAILS,
  ],
}

/** Role Action Scope
 * - Check if action can be performed according to user role
 * - EDIT_BY_OWNER & PUBLISH can only be done for users that are protocol owners.
 */
const Role_SCOPE: { [key in keyof typeof Role]: Action[] } = {
  [Role.RESEARCHER]: [
    Action.CREATE,
    Action.EDIT_BY_OWNER,
    Action.PUBLISH,
    Action.VIEW_ANUAL_BUDGET,
  ],
  [Role.SECRETARY]: [
    Action.ACCEPT,
    Action.CREATE,
    Action.EDIT,
    Action.EDIT_BY_OWNER,
    Action.PUBLISH,
    Action.VIEW_ANUAL_BUDGET,
<<<<<<< HEAD
    Action.ASSIGN_TO_METHODOLOGIST,
    Action.ASSIGN_TO_SCIENTIFIC,
=======
>>>>>>> origin/develop
  ],
  [Role.METHODOLOGIST]: [
    Action.REVIEW,
    Action.CREATE,
    Action.EDIT_BY_OWNER,
    Action.PUBLISH,
  ],
  [Role.SCIENTIST]: [Action.REVIEW],
  [Role.ADMIN]: [
    Action.CREATE,
    Action.EDIT,
    Action.EDIT_BY_OWNER,
    Action.PUBLISH,
    Action.ACCEPT,
    Action.APPROVE,
    Action.ASSIGN_TO_METHODOLOGIST,
    Action.ASSIGN_TO_SCIENTIFIC,
    Action.DELETE,
    Action.DISCONTINUE,
    Action.FINISH,
    Action.VIEW_ANUAL_BUDGET,
    Action.GENERATE_ANUAL_BUDGET,
    Action.REACTIVATE,
  ],
}

/** ProtocolState Action Scope
 * - Check if an action can be performed according current protocol state
 */
const STATE_SCOPE: { [key in keyof typeof ProtocolState]: Action[] } = {
  [ProtocolState.DRAFT]: [Action.EDIT_BY_OWNER, Action.PUBLISH, Action.DELETE],
  [ProtocolState.PUBLISHED]: [
    Action.ASSIGN_TO_METHODOLOGIST,
    Action.EDIT,
    Action.DISCONTINUE,
  ],
  [ProtocolState.METHODOLOGICAL_EVALUATION]: [
    Action.ASSIGN_TO_METHODOLOGIST, // It's a Re-assignation
    Action.EDIT_BY_OWNER,
    Action.REVIEW,
    Action.ASSIGN_TO_SCIENTIFIC,
    Action.DISCONTINUE,
  ],
  [ProtocolState.SCIENTIFIC_EVALUATION]: [
    Action.ASSIGN_TO_SCIENTIFIC, // Allows re-assignation
    Action.EDIT_BY_OWNER,
    Action.REVIEW,
    Action.ACCEPT,
    Action.DISCONTINUE,
  ],
  [ProtocolState.ACCEPTED]: [
    Action.APPROVE,
    Action.DISCONTINUE,
    Action.EDIT,
    Action.GENERATE_ANUAL_BUDGET,
    Action.VIEW_ANUAL_BUDGET,
  ],
  [ProtocolState.ON_GOING]: [
    Action.FINISH,
    Action.VIEW_ANUAL_BUDGET,
    Action.GENERATE_ANUAL_BUDGET,
  ],
  [ProtocolState.FINISHED]: [],
<<<<<<< HEAD
  [ProtocolState.DISCONTINUED]: [Action.REACTIVATE],
=======
  [ProtocolState.DISCONTINUED]: [
    Action.REACTIVATE
  ],
>>>>>>> origin/develop
  [ProtocolState.DELETED]: [],
}

/**
 * Check Access to resource by current user role
 * @param access
 * @param role
 * @returns
 */
export const canAccess = (access: Access, role: Role) =>
  Role_ACCESS[role].includes(access)

/**
 * Check Execution Permission according to ProtocolState and Role
 * @param action
 * @param role
 * @param state
 * @returns
 */
export const canExecute = (action: Action, role: Role, state: ProtocolState) =>
  Role_SCOPE[role].includes(action) && STATE_SCOPE[state].includes(action)

export const getActionsByRoleAndState = (role: Role, state: ProtocolState) =>
  Role_SCOPE[role].filter((action) => STATE_SCOPE[state].includes(action))
