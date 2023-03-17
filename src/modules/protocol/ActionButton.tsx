'use client'
import { canAccess, canExecute } from '@utils/scopes'
import { ActionSchema, RoleType, StateType } from '@utils/zod'

type ActionButtonTypes = { role: RoleType; state: StateType }

export default function ActionButton(props: ActionButtonTypes) {
    const ACTION = ActionSchema.enum.LIST
    return (
        <div className="border p-4 rounded-lg flex">
            <span className="font-light flex-1">
                Action: {ACTION} | Role: {props.role} | State: {props.state}
            </span>
            {canExecute(ACTION, props.role, props.state) ? (
                <span className="font-bold text-sm bg-base-900 text-white rounded-full px-4 py-1">
                    Ex ALLOWED
                </span>
            ) : (
                <span className="font-bold text-sm bg-base-100 text-black rounded-full px-4 py-1">
                    Ex NOT ALLOWED
                </span>
            )}{' '}
            {canAccess(ACTION, props.role) ? (
                <span className="font-bold text-sm bg-base-900 text-white rounded-full px-4 py-1">
                    Acc ALLOWED
                </span>
            ) : (
                <span className="font-bold text-sm bg-base-100 text-black rounded-full px-4 py-1">
                    Acc NOT ALLOWED
                </span>
            )}
        </div>
    )
}
