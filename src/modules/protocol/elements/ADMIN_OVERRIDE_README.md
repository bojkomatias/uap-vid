# Admin Override Functionality

## Overview

This feature allows administrators to approve and accept projects even when certain validation checks fail, while providing clear warnings about what conditions are not met. This ensures that admins have the flexibility to handle edge cases while maintaining transparency about the state of the protocol.

## Implementation Details

### Files Modified

1. **`src/app/(authenticated)/protocols/[id]/@actions/page.tsx`**
   - Performs validation checks for `PUBLISH`, `ACCEPT`, and `APPROVE` actions.
   - For administrators, it ensures that these key actions are always available for override, even if disallowed by the protocol's current state or failed validation checks.
   - For other users, it correctly filters out actions that fail validation.
   - Passes a detailed `checkResults` object and the user's role to the `ActionsDropdown` client component.

2. **`src/modules/protocol/elements/actions-dropdown.tsx`**
   - Contains the client-side logic for the override functionality.
   - Uses the `checkResults` prop to determine if a warning dialog is needed for an action.
   - Manages the state and rendering of the override warning dialog.
   - Handles the execution of the action after admin confirmation.

### Key Features

#### 1. Check Results Tracking
The system now tracks the following validation results:

- **Publish Action:**
  - Protocol completeness validation
  - Convocatory assignment check
  - Detailed error messages for each failure

- **Accept Action:**
  - Review completion status
  - Verification that all evaluations are complete

- **Approve Action:**
  - Protocol flags validation
  - Required flags count verification

#### 2. Admin Override Dialog
When an admin attempts to perform an action that doesn't meet the standard requirements:

- A warning dialog appears with:
  - Clear description of what checks failed
  - Warning about proceeding as administrator
  - Option to cancel or proceed
  - Visual indicators (warning icon, yellow styling)

#### 3. Conditional Action Filtering & Override Logic
The system now uses a two-step process:

- **Server-Side (`page.tsx`):**
  - **For non-admin users:** Actions that fail validation checks are filtered out and are not sent to the client.
  - **For admin users:** Key actions like `PUBLISH`, `ACCEPT`, and `APPROVE` are *always* included in the list sent to the client, ensuring they are visible in the dropdown menu regardless of the protocol's state or validation results.
- **Client-Side (`actions-dropdown.tsx`):**
  - When an admin clicks an action, the component checks the `checkResults`. If a check has failed for that action, it displays the override warning dialog instead of executing the action directly.

### User Experience

#### For Regular Users
- No change in behavior
- Actions are only available when all requirements are met
- Clear error messages when actions are not available

#### For Administrators
- All actions remain visible in the dropdown
- When clicking an action that doesn't meet requirements:
  1. A warning dialog appears
  2. Shows specific issues that need attention
  3. Provides option to proceed or cancel
  4. Clear indication of administrative responsibility

### Technical Implementation

#### State Management
```typescript
type CheckResults = {
  publish: {
    isValid: boolean
    hasConvocatory: boolean
    message: string
  }
  accept: {
    allReviewed: boolean
    message: string
  }
  approve: {
    allFlagsValid: boolean
    hasRequiredFlags: boolean
    message: string
  }
}
```

#### Dialog State
```typescript
{
  open: boolean
  action: Action | null
  message: string
  callback: (() => void) | null
}
```

#### Override Flow
The override process is split between the server component (`page.tsx`) and the client component (`actions-dropdown.tsx`):

1. **Server-Side Preparation (`page.tsx`):**
  - The server component gathers protocol data, user session, and performs all necessary validation checks (`Publish`, `Accept`, `Approve`), storing the results in a `checkResults` object.
  - It determines the base list of actions based on the user's role and the protocol's state.
  - If the user is an **Admin**, it ensures `PUBLISH`, `ACCEPT`, and `APPROVE` are present in the final list of actions, adding them if they were filtered out by state restrictions.
  - If the user is **not an Admin**, it removes actions from the list if they fail validation checks.
  - The final list of actions and the `checkResults` are passed to the client.

2. **Client-Side Execution (`actions-dropdown.tsx`):**
  - The dropdown menu is rendered with the actions provided by the server. For admins, this includes the override-able actions.
  - When an admin clicks an action, its `callback` function is triggered.
  - The callback first checks if the user is an admin and if the corresponding check in `checkResults` has failed.
  - If both are true, it opens the **Admin Override Warning Dialog** with a specific message and stores the original action logic to be executed upon confirmation.
  - If the checks passed (or the user is not an admin), the action logic executes immediately.
  - If the admin confirms in the dialog, the stored action logic is executed.

### Security Considerations

- Only users with `ADMIN` role can use override functionality
- Override actions are logged in the system (existing logging infrastructure)
- Clear audit trail of when overrides were used
- Warning dialogs ensure admins are aware of their actions

### Error Messages

The system provides specific, actionable error messages:

- **Publish Issues:**
  - "El protocolo no está completo. Debe completar todas las secciones y los campos requeridos."
  - "El protocolo no tiene una convocatoria asignada."

- **Accept Issues:**
  - "No todas las evaluaciones han sido completadas. Algunas evaluaciones aún están pendientes."

- **Approve Issues:**
  - "Algunas banderas del protocolo no están aprobadas."
  - "El protocolo no tiene las banderas requeridas (se necesitan al menos 2)."

### Future Enhancements

1. **Audit Logging:** Enhanced logging of override actions
2. **Bulk Operations:** Support for overriding multiple protocols at once
3. **Conditional Overrides:** Different override levels based on admin permissions
4. **Notification System:** Alert other admins when overrides are used
5. **Override History:** Track and display override history for protocols

### Testing Considerations

When testing this functionality:

1. **Admin User Testing:**
  - Verify override dialogs appear for failed checks
  - Confirm actions execute properly after override
  - Test cancel functionality

2. **Non-Admin User Testing:**
  - Verify actions are properly filtered out
  - Confirm no override dialogs appear
  - Test error message display

3. **Edge Cases:**
  - Multiple failed checks for same action
  - Network failures during override execution
  - Session expiration during override process

## Conclusion

This implementation provides administrators with the necessary flexibility to handle exceptional cases while maintaining system integrity and providing clear visibility into the state of protocols. The warning dialogs ensure that admins are fully aware of what they're doing when using override functionality. 