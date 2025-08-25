# UAP Research Protocol Management System

## Proyecto de la UAP
To do:
- [] Descripción de la arquitectura el proyecto
  - [] Explicación de la estructura de archivos y carpetas
  - [] Diagrama de despliegue
## Docker setup

### Build the docker image

`docker build -t uap:latest .`

### Run the docker container

#### In production

Would run:
`docker-compose up -d --name uap`
Check the _deploy.sh_ file.

#### In development mode, passing .env file to use Cloud MongoDB

`docker run -e ".env" -p 3000:3000 uap:latest`

## Team Member Budget Synchronization

### Overview

The system now automatically synchronizes protocol team member changes with annual budget allocations for ongoing protocols. This ensures that budget calculations remain accurate when team members are added, removed, or modified during project execution.

### Key Features

- **Automatic Synchronization**: When team members are modified in ongoing protocols, the corresponding annual budget team members are automatically updated
- **Execution History Preservation**: All previous executions and payments are preserved when team members are removed or modified
- **Proportional Budget Allocation**: New team members added mid-year receive proportional budget allocations based on remaining time
- **Real-time Budget Updates**: Budget summaries and calculations reflect changes immediately after team member modifications

### How It Works

#### For Removed/Deactivated Team Members:
- ✅ Execution history is preserved
- ✅ Remaining hours are set to zero
- ✅ Total hours are adjusted to reflect only executed time
- ✅ Budget projections are updated accordingly

#### For Added/Reactivated Team Members:
- ✅ New budget allocation is created for the current year
- ✅ Hours are calculated proportionally based on remaining time in the year
- ✅ Budget projections include the new team member

#### For Modified Team Members:
- ✅ Role and hour changes are reflected in the budget
- ✅ Execution history is preserved
- ✅ Remaining hours are recalculated based on new total hours minus executed hours

### Automatic Triggers

The synchronization is automatically triggered when:

1. **Deactivating a team member** via the protocol interface
2. **Reactivating a team member** via the protocol interface  
3. **Updating team members** through the Confirm Team Members form
4. **Editing protocol team members** through the protocol form

### Manual Synchronization

For administrative purposes, a bulk synchronization function is available:

```typescript
import { syncAllOngoingProtocolsWithBudgets } from '@actions/anual-budget/action'

// Synchronize all ongoing protocols for current year
const result = await syncAllOngoingProtocolsWithBudgets()

// Synchronize for specific year
const result = await syncAllOngoingProtocolsWithBudgets(2024)
```

### Testing and Management Tool

A comprehensive testing and management tool is available for administrators:

```bash
# Analyze synchronization needs without making changes
npm run test-team-sync analyze

# Analyze for specific year
npm run test-team-sync analyze 2024

# Test synchronization on a specific protocol
npm run test-team-sync test <protocol-id>

# Run bulk synchronization for current year
npm run test-team-sync sync

# Run bulk synchronization for specific year
npm run test-team-sync sync 2024

# Show current database statistics
npm run test-team-sync status
```

The tool provides:
- **Analysis mode**: Shows what changes would be made without executing them
- **Test mode**: Runs synchronization on a single protocol with detailed output
- **Sync mode**: Performs bulk synchronization on all ongoing protocols
- **Status mode**: Displays current database state and statistics

### Important Notes

- **Only applies to ongoing protocols**: Synchronization only occurs for protocols in `ON_GOING` state
- **Only affects approved budgets**: Only annual budgets in `APPROVED` state are synchronized
- **Transaction safety**: All synchronization operations are wrapped in database transactions
- **Error handling**: Synchronization errors don't prevent the main team member operations from completing
- **Logging**: Comprehensive logging is provided for monitoring and debugging

### Permissions

The system now allows `EDIT` actions on ongoing protocols to enable team member modifications. This is controlled through the existing role-based permission system.

### User Interface Changes

- Success messages now indicate when budget synchronization has occurred
- Deactivation/reactivation notifications inform users about automatic budget updates
- Form submissions in ongoing protocols show enhanced confirmation messages

### Technical Implementation

Key functions:
- `syncProtocolTeamMembersWithBudget()`: Core synchronization logic
- `calculateMemberHours()`: Helper for hour calculations
- `syncAllOngoingProtocolsWithBudgets()`: Bulk synchronization utility

Integration points:
- `deactivateTeamMember()` and `reactivateTeamMember()` in team member repository
- `updateProtocolTeamMembers()` in protocol repository
- `updateProtocolById()` in protocol repository

This functionality ensures that budget tracking remains accurate and up-to-date throughout the entire project lifecycle, providing administrators and researchers with reliable financial projections.
