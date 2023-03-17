import {
    RoleSchema,
    RoleType,
    StateSchema,
    StateType,
    ActionSchema,
    ActionType,
} from './zod'

const ROLE = RoleSchema.Enum
const STATE = StateSchema.Enum
const ACTION = ActionSchema.Enum

// Check if role its allowed
const ROLE_SCOPE = {
    [ROLE.RESEARCHER]: [
        ACTION.PUBLISH,
        ACTION.CREATE,
        ACTION.EDIT,
        ACTION.VIEW,
    ],
    [ROLE.SECRETARY]: [ACTION.ACCEPT, ACTION.VIEW],
    [ROLE.METHODOLOGIST]: [ACTION.VIEW, ACTION.COMMENT],
    [ROLE.EVALUATOR]: [ACTION.VIEW, ACTION.COMMENT],
    [ROLE.ADMIN]: [
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
    [STATE.DRAFT]: [ACTION.PUBLISH],
    [STATE.METHOD]: [ACTION.COMMENT],
    [STATE.SCIENTIFIC]: [ACTION.COMMENT],
    [STATE.ACCEPTED]: [ACTION.VIEW],
    [STATE.ONGOING]: [ACTION.VIEW],
}

export function canExecute(
    action: ActionType,
    role: RoleType,
    state: StateType
) {
    if (
        ROLE_SCOPE[role].includes(action) &&
        STATE_SCOPE[state].includes(action)
    )
        return true
    return false
}
