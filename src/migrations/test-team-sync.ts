import { PrismaClient, ProtocolState, AnualBudgetState } from '@prisma/client'
import type {
  Protocol,
  AnualBudget,
  AnualBudgetTeamMember,
  TeamMember,
  Execution,
  ProtocolSectionsIdentificationTeam,
} from '@prisma/client'
import * as dotenv from 'dotenv'
import path from 'path'

// Mock React's cache function for Node.js environment
const mockCache = <T extends (...args: any[]) => any>(fn: T): T => {
  return fn
}

// Set up module mocking for React cache
const Module = require('module')
const originalLoad = Module._load

Module._load = function (request: string, parent: any) {
  if (request === 'react') {
    return { cache: mockCache }
  }
  if (request === 'next/cache') {
    return { cache: mockCache }
  }
  return originalLoad.apply(this, arguments)
}

// Load environment variables from the project root
dotenv.config({ path: path.resolve(__dirname, '../../.env') })
dotenv.config({ path: path.resolve(__dirname, '../../.env.local') })

// Verify DATABASE_URL is available
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set')
  console.log(
    'Please make sure you have a .env file in your project root with DATABASE_URL'
  )
  process.exit(1)
}

const prisma = new PrismaClient()

// Define complex types for our queries
type ProtocolWithBudgets = Protocol & {
  anualBudgets: (AnualBudget & {
    budgetTeamMembers: (AnualBudgetTeamMember & {
      teamMember: TeamMember | null
      executions: Execution[]
    })[]
  })[]
  sections: {
    identification: {
      title: string
      team: ProtocolSectionsIdentificationTeam[]
    }
    duration: {
      duration: string
    }
  }
}

type BudgetTeamMemberWithDetails = AnualBudgetTeamMember & {
  teamMember: TeamMember | null
  executions: Execution[]
}

interface TeamMemberSyncAnalysis {
  protocolId: string
  title: string
  budgetId: string
  currentBudgetTeamMembers: number
  activeProtocolTeamMembers: number
  membersToAdd: number
  membersToRemove: number
  membersToUpdate: number
  details: {
    toAdd: Array<{ role: string; teamMemberId?: string }>
    toRemove: Array<{
      role: string
      executedHours: number
      remainingHours: number
      hasExecutions: boolean
    }>
    toUpdate: Array<{
      role: string
      currentHours: number
      newHours: number
    }>
  }
}

/**
 * Analyzes synchronization needs for ongoing protocols without making changes
 */
async function analyzeTeamMemberSync(
  year: number = new Date().getFullYear()
): Promise<void> {
  console.log(`🔍 Analyzing team member synchronization needs for ${year}...\n`)

  try {
    // Find ongoing protocols with approved budgets
    console.log('📊 Finding ongoing protocols with approved budgets...')

    const ongoingProtocols = await prisma.protocol.findMany({
      where: {
        state: ProtocolState.ON_GOING,
        anualBudgets: {
          some: {
            state: AnualBudgetState.APPROVED,
            year: year,
          },
        },
      },
      include: {
        anualBudgets: {
          where: {
            state: AnualBudgetState.APPROVED,
            year: year,
          },
          include: {
            budgetTeamMembers: {
              include: {
                teamMember: true,
                executions: true,
              },
            },
          },
        },
      },
    })

    console.log(
      `Found ${ongoingProtocols.length} ongoing protocols with approved budgets\n`
    )

    if (ongoingProtocols.length === 0) {
      console.log('ℹ️  No ongoing protocols with approved budgets found.')
      return
    }

    const analyses: TeamMemberSyncAnalysis[] = []
    let totalNeedingSync = 0

    // Analyze each protocol
    for (const protocol of ongoingProtocols) {
      const budget = protocol.anualBudgets[0]
      if (!budget) continue

      // Get active protocol team members (those without 'to' date)
      const activeProtocolTeam = protocol.sections.identification.team.filter(
        (member: ProtocolSectionsIdentificationTeam) => {
          const activeAssignment = member.assignments?.find((a) => !a.to)
          return !!activeAssignment
        }
      )

      // Create maps for comparison
      const budgetTeamMap = new Map(
        budget.budgetTeamMembers.map((member: BudgetTeamMemberWithDetails) => [
          member.teamMemberId || `category_${member.categoryId}`,
          member,
        ])
      )

      const protocolTeamMap = new Map(
        activeProtocolTeam.map((member: ProtocolSectionsIdentificationTeam) => [
          member.teamMemberId || `category_${member.categoryToBeConfirmed}`,
          member,
        ])
      )

      // Find differences
      const toAdd = activeProtocolTeam.filter(
        (member: ProtocolSectionsIdentificationTeam) => {
          const key =
            member.teamMemberId || `category_${member.categoryToBeConfirmed}`
          return !budgetTeamMap.has(key)
        }
      )

      const toRemove = budget.budgetTeamMembers.filter(
        (member: BudgetTeamMemberWithDetails) => {
          const key = member.teamMemberId || `category_${member.categoryId}`
          return !protocolTeamMap.has(key)
        }
      )

      const toUpdate = activeProtocolTeam.filter(
        (protocolMember: ProtocolSectionsIdentificationTeam) => {
          const key =
            protocolMember.teamMemberId ||
            `category_${protocolMember.categoryToBeConfirmed}`
          const budgetMember = budgetTeamMap.get(key)
          if (!budgetMember) return false

          const activeAssignment = protocolMember.assignments?.find(
            (a) => !a.to
          )
          return (
            activeAssignment &&
            (budgetMember.memberRole !== protocolMember.role ||
              Math.abs(budgetMember.hours - (activeAssignment.hours || 1)) >
                0.1)
          )
        }
      )

      const analysis: TeamMemberSyncAnalysis = {
        protocolId: protocol.id,
        title: protocol.sections.identification.title,
        budgetId: budget.id,
        currentBudgetTeamMembers: budget.budgetTeamMembers.length,
        activeProtocolTeamMembers: activeProtocolTeam.length,
        membersToAdd: toAdd.length,
        membersToRemove: toRemove.length,
        membersToUpdate: toUpdate.length,
        details: {
          toAdd: toAdd.map((member: ProtocolSectionsIdentificationTeam) => ({
            role: member.role,
            teamMemberId: member.teamMemberId || undefined,
          })),
          toRemove: toRemove.map((member: BudgetTeamMemberWithDetails) => ({
            role: member.memberRole,
            executedHours: member.hours - member.remainingHours,
            remainingHours: member.remainingHours,
            hasExecutions: (member.executions?.length || 0) > 0,
          })),
          toUpdate: toUpdate.map(
            (protocolMember: ProtocolSectionsIdentificationTeam) => {
              const key =
                protocolMember.teamMemberId ||
                `category_${protocolMember.categoryToBeConfirmed}`
              const budgetMember = budgetTeamMap.get(key)!
              const activeAssignment = protocolMember.assignments?.find(
                (a) => !a.to
              )
              return {
                role: protocolMember.role,
                currentHours: budgetMember.hours,
                newHours: activeAssignment?.hours || 1,
              }
            }
          ),
        },
      }

      analyses.push(analysis)

      if (
        analysis.membersToAdd > 0 ||
        analysis.membersToRemove > 0 ||
        analysis.membersToUpdate > 0
      ) {
        totalNeedingSync++
      }
    }

    // Display results
    console.log(`📋 Analysis Results:\n`)
    console.log(`Total protocols analyzed: ${ongoingProtocols.length}`)
    console.log(`Protocols needing synchronization: ${totalNeedingSync}`)
    console.log(
      `Protocols already synchronized: ${ongoingProtocols.length - totalNeedingSync}\n`
    )

    if (totalNeedingSync > 0) {
      console.log(`🔄 Protocols requiring synchronization:\n`)

      analyses
        .filter(
          (a) =>
            a.membersToAdd > 0 || a.membersToRemove > 0 || a.membersToUpdate > 0
        )
        .forEach((analysis, index) => {
          console.log(`${index + 1}. ${analysis.title}`)
          console.log(`   Protocol ID: ${analysis.protocolId}`)
          console.log(`   Budget ID: ${analysis.budgetId}`)
          console.log(
            `   Current budget team members: ${analysis.currentBudgetTeamMembers}`
          )
          console.log(
            `   Active protocol team members: ${analysis.activeProtocolTeamMembers}`
          )

          if (analysis.membersToAdd > 0) {
            console.log(`   ➕ Members to add: ${analysis.membersToAdd}`)
            analysis.details.toAdd.forEach((member) => {
              console.log(
                `      - ${member.role} ${member.teamMemberId ? `(ID: ${member.teamMemberId})` : '(Category member)'}`
              )
            })
          }

          if (analysis.membersToRemove > 0) {
            console.log(`   ➖ Members to remove: ${analysis.membersToRemove}`)
            analysis.details.toRemove.forEach((member) => {
              console.log(
                `      - ${member.role} (executed: ${member.executedHours}h, remaining: ${member.remainingHours}h${member.hasExecutions ? ', has executions' : ''})`
              )
            })
          }

          if (analysis.membersToUpdate > 0) {
            console.log(`   🔄 Members to update: ${analysis.membersToUpdate}`)
            analysis.details.toUpdate.forEach((member) => {
              console.log(
                `      - ${member.role} (${member.currentHours}h → ${member.newHours}h)`
              )
            })
          }

          console.log('')
        })
    } else {
      console.log('✅ All protocols are already synchronized!')
    }
  } catch (error) {
    console.error('❌ Analysis failed:', error)
    throw error
  }
}

/**
 * Tests the synchronization function on a single protocol (dry run)
 */
async function testSingleProtocolSync(protocolId: string): Promise<void> {
  console.log(`🧪 Testing synchronization for protocol: ${protocolId}\n`)

  try {
    console.log('🔄 Running synchronization simulation (safe mode)...')

    // Get the protocol data directly
    const protocol = await prisma.protocol.findUnique({
      where: { id: protocolId },
      include: {
        anualBudgets: {
          where: {
            state: AnualBudgetState.APPROVED,
            year: new Date().getFullYear(),
          },
          include: {
            budgetTeamMembers: {
              include: {
                executions: true,
                teamMember: true,
              },
            },
          },
        },
      },
    })

    if (!protocol) {
      console.log('❌ Protocol not found')
      return
    }

    if (protocol.state !== ProtocolState.ON_GOING) {
      console.log('⚠️  Protocol is not in ongoing state')
      return
    }

    const budget = protocol.anualBudgets[0]
    if (!budget) {
      console.log('⚠️  No approved budget found for current year')
      return
    }

    // Simulate the synchronization logic
    const activeProtocolTeam = protocol.sections.identification.team.filter(
      (member: ProtocolSectionsIdentificationTeam) => {
        const activeAssignment = member.assignments?.find((a) => !a.to)
        return !!activeAssignment
      }
    )

    const budgetTeamMap = new Map(
      budget.budgetTeamMembers.map((member) => [
        member.teamMemberId || `category_${member.categoryId}`,
        member,
      ])
    )

    const protocolTeamMap = new Map(
      activeProtocolTeam.map((member) => [
        member.teamMemberId || `category_${member.categoryToBeConfirmed}`,
        member,
      ])
    )

    const toAdd = activeProtocolTeam.filter((member) => {
      const key =
        member.teamMemberId || `category_${member.categoryToBeConfirmed}`
      return !budgetTeamMap.has(key)
    })

    const toRemove = budget.budgetTeamMembers.filter((member) => {
      const key = member.teamMemberId || `category_${member.categoryId}`
      return !protocolTeamMap.has(key)
    })

    console.log('\n📊 Simulation Results:')
    console.log(`Status: ✅ Simulation Complete (no actual changes made)`)
    console.log(`Protocol: ${protocol.sections.identification.title}`)
    console.log(`Operations that would be performed:`)
    console.log(`  - Added: ${toAdd.length}`)
    console.log(`  - Removed: ${toRemove.length}`)
    console.log(
      `  - Current budget team members: ${budget.budgetTeamMembers.length}`
    )
    console.log(
      `  - Active protocol team members: ${activeProtocolTeam.length}`
    )

    if (toAdd.length > 0) {
      console.log('\n➕ Members that would be added:')
      toAdd.forEach((member) => {
        console.log(
          `  - ${member.role} ${member.teamMemberId ? `(ID: ${member.teamMemberId})` : '(Category member)'}`
        )
      })
    }

    if (toRemove.length > 0) {
      console.log('\n➖ Members that would be removed:')
      toRemove.forEach((member) => {
        const executedHours = member.hours - member.remainingHours
        console.log(
          `  - ${member.memberRole} (executed: ${executedHours}h, remaining: ${member.remainingHours}h)`
        )
      })
    }
  } catch (error) {
    console.error('❌ Test failed:', error)
    throw error
  }
}

/**
 * Performs bulk synchronization simulation on all ongoing protocols
 * NOTE: This is a simulation mode for safety. To perform actual synchronization,
 * use the web interface or call the action functions directly from a Next.js environment.
 */
async function runBulkSync(
  year: number = new Date().getFullYear()
): Promise<void> {
  console.log(
    `🚀 Running bulk synchronization SIMULATION for year ${year}...\n`
  )
  console.log(
    `⚠️  NOTE: This is a safe simulation mode. No actual changes will be made.\n`
  )

  try {
    // Get all ongoing protocols with approved budgets
    const ongoingProtocols = await prisma.protocol.findMany({
      where: {
        state: ProtocolState.ON_GOING,
        anualBudgets: {
          some: {
            state: AnualBudgetState.APPROVED,
            year: year,
          },
        },
      },
      include: {
        anualBudgets: {
          where: {
            state: AnualBudgetState.APPROVED,
            year: year,
          },
          include: {
            budgetTeamMembers: {
              include: {
                executions: true,
                teamMember: true,
              },
            },
          },
        },
      },
    })

    console.log(
      `📊 Found ${ongoingProtocols.length} ongoing protocols with approved budgets`
    )

    let protocolsNeedingSync = 0
    let totalOperations = { added: 0, removed: 0, updated: 0 }

    console.log('\n📋 Simulation Results:')

    for (const protocol of ongoingProtocols) {
      const budget = protocol.anualBudgets[0]
      if (!budget) continue

      // Get active protocol team members
      const activeProtocolTeam = protocol.sections.identification.team.filter(
        (member: ProtocolSectionsIdentificationTeam) => {
          const activeAssignment = member.assignments?.find((a) => !a.to)
          return !!activeAssignment
        }
      )

      // Create maps for comparison
      const budgetTeamMap = new Map(
        budget.budgetTeamMembers.map((member) => [
          member.teamMemberId || `category_${member.categoryId}`,
          member,
        ])
      )

      const protocolTeamMap = new Map(
        activeProtocolTeam.map((member) => [
          member.teamMemberId || `category_${member.categoryToBeConfirmed}`,
          member,
        ])
      )

      // Find differences
      const toAdd = activeProtocolTeam.filter((member) => {
        const key =
          member.teamMemberId || `category_${member.categoryToBeConfirmed}`
        return !budgetTeamMap.has(key)
      })

      const toRemove = budget.budgetTeamMembers.filter((member) => {
        const key = member.teamMemberId || `category_${member.categoryId}`
        return !protocolTeamMap.has(key)
      })

      const toUpdate = activeProtocolTeam.filter((protocolMember) => {
        const key =
          protocolMember.teamMemberId ||
          `category_${protocolMember.categoryToBeConfirmed}`
        const budgetMember = budgetTeamMap.get(key)
        if (!budgetMember) return false

        const activeAssignment = protocolMember.assignments?.find((a) => !a.to)
        return (
          activeAssignment &&
          (budgetMember.memberRole !== protocolMember.role ||
            Math.abs(budgetMember.hours - (activeAssignment.hours || 1)) > 0.1)
        )
      })

      if (toAdd.length > 0 || toRemove.length > 0 || toUpdate.length > 0) {
        protocolsNeedingSync++
        totalOperations.added += toAdd.length
        totalOperations.removed += toRemove.length
        totalOperations.updated += toUpdate.length

        console.log(
          `\n${protocolsNeedingSync}. 🔄 ${protocol.sections.identification.title}`
        )
        console.log(`   Protocol ID: ${protocol.id}`)
        console.log(
          `   Operations: +${toAdd.length} -${toRemove.length} ~${toUpdate.length}`
        )
      }
    }

    console.log('\n📊 Bulk Simulation Summary:')
    console.log(`  - Total protocols analyzed: ${ongoingProtocols.length}`)
    console.log(`  - Protocols needing sync: ${protocolsNeedingSync}`)
    console.log(
      `  - Protocols already synced: ${ongoingProtocols.length - protocolsNeedingSync}`
    )
    console.log(`  - Total operations that would be performed:`)
    console.log(`    • Members to add: ${totalOperations.added}`)
    console.log(`    • Members to remove: ${totalOperations.removed}`)
    console.log(`    • Members to update: ${totalOperations.updated}`)

    if (protocolsNeedingSync > 0) {
      console.log('\n💡 To perform actual synchronization:')
      console.log('   1. Use the web interface team member management')
      console.log(
        '   2. Or call syncAllOngoingProtocolsWithBudgets() from a Next.js environment'
      )
    } else {
      console.log('\n✅ All protocols are already synchronized!')
    }
  } catch (error) {
    console.error('❌ Bulk simulation failed:', error)
    throw error
  }
}

/**
 * Performs actual synchronization for a single protocol
 */
async function syncSingleProtocol(protocolId: string): Promise<void> {
  console.log(`🔄 Synchronizing protocol: ${protocolId}\n`)

  try {
    // Get the protocol data
    const protocol = await prisma.protocol.findUnique({
      where: { id: protocolId },
      include: {
        anualBudgets: {
          where: {
            state: AnualBudgetState.APPROVED,
            year: new Date().getFullYear(),
          },
          include: {
            budgetTeamMembers: {
              include: {
                executions: true,
                teamMember: true,
              },
            },
          },
        },
      },
    })

    if (!protocol) {
      console.log('❌ Protocol not found')
      return
    }

    if (protocol.state !== ProtocolState.ON_GOING) {
      console.log('⚠️  Protocol is not in ongoing state')
      return
    }

    const budget = protocol.anualBudgets[0]
    if (!budget) {
      console.log('⚠️  No approved budget found for current year')
      return
    }

    console.log(`📋 Protocol: ${protocol.sections.identification.title}`)
    console.log(`💰 Budget ID: ${budget.id}\n`)

    // Get active protocol team members
    const activeProtocolTeam = protocol.sections.identification.team.filter(
      (member: ProtocolSectionsIdentificationTeam) => {
        const activeAssignment = member.assignments?.find((a) => !a.to)
        return !!activeAssignment
      }
    )

    // Create maps for comparison
    const budgetTeamMap = new Map(
      budget.budgetTeamMembers.map((member) => [
        member.teamMemberId || `category_${member.categoryId}`,
        member,
      ])
    )

    const protocolTeamMap = new Map(
      activeProtocolTeam.map((member) => [
        member.teamMemberId || `category_${member.categoryToBeConfirmed}`,
        member,
      ])
    )

    // Find differences
    const toAdd = activeProtocolTeam.filter((member) => {
      const key =
        member.teamMemberId || `category_${member.categoryToBeConfirmed}`
      return !budgetTeamMap.has(key)
    })

    const toRemove = budget.budgetTeamMembers.filter((member) => {
      const key = member.teamMemberId || `category_${member.categoryId}`
      const protocolMember = protocolTeamMap.get(key)

      // Don't remove if member has executions
      if ((member.executions?.length || 0) > 0) {
        console.log(
          `⚠️  Skipping removal of ${member.memberRole} - has executions`
        )
        return false
      }

      return !protocolMember
    })

    const toUpdate = activeProtocolTeam.filter((protocolMember) => {
      const key =
        protocolMember.teamMemberId ||
        `category_${protocolMember.categoryToBeConfirmed}`
      const budgetMember = budgetTeamMap.get(key)
      if (!budgetMember) return false

      const activeAssignment = protocolMember.assignments?.find((a) => !a.to)
      return (
        activeAssignment &&
        (budgetMember.memberRole !== protocolMember.role ||
          Math.abs(budgetMember.hours - (activeAssignment.hours || 1)) > 0.1)
      )
    })

    console.log('📊 Operations to perform:')
    console.log(`  - Add: ${toAdd.length} members`)
    console.log(`  - Remove: ${toRemove.length} members`)
    console.log(`  - Update: ${toUpdate.length} members\n`)

    if (toAdd.length === 0 && toRemove.length === 0 && toUpdate.length === 0) {
      console.log('✅ Protocol is already synchronized!')
      return
    }

    // Perform operations in a transaction
    await prisma.$transaction(async (tx) => {
      // Add new members
      for (const member of toAdd) {
        const activeAssignment = member.assignments?.find((a) => !a.to)
        const hours = activeAssignment?.hours || 1

        console.log(`➕ Adding ${member.role} (${hours}h)`)

        await tx.anualBudgetTeamMember.create({
          data: {
            anualBudgetId: budget.id,
            teamMemberId: member.teamMemberId || undefined,
            categoryId: member.categoryToBeConfirmed || undefined,
            memberRole: member.role,
            hours: hours,
            remainingHours: hours,
          },
        })
      }

      // Remove members (only those without executions)
      for (const member of toRemove) {
        console.log(`➖ Removing ${member.memberRole}`)

        await tx.anualBudgetTeamMember.delete({
          where: { id: member.id },
        })
      }

      // Update existing members
      for (const protocolMember of toUpdate) {
        const key =
          protocolMember.teamMemberId ||
          `category_${protocolMember.categoryToBeConfirmed}`
        const budgetMember = budgetTeamMap.get(key)!
        const activeAssignment = protocolMember.assignments?.find((a) => !a.to)
        const newHours = activeAssignment?.hours || 1

        // Calculate new remaining hours based on the difference
        const executedHours = budgetMember.hours - budgetMember.remainingHours
        const newRemainingHours = Math.max(0, newHours - executedHours)

        console.log(
          `🔄 Updating ${protocolMember.role}: ${budgetMember.hours}h → ${newHours}h (remaining: ${newRemainingHours}h)`
        )

        await tx.anualBudgetTeamMember.update({
          where: { id: budgetMember.id },
          data: {
            memberRole: protocolMember.role,
            hours: newHours,
            remainingHours: newRemainingHours,
          },
        })
      }
    })

    console.log('\n✅ Synchronization completed successfully!')

    // Show final state
    const updatedBudget = await prisma.anualBudget.findUnique({
      where: { id: budget.id },
      include: {
        budgetTeamMembers: {
          include: { teamMember: true },
        },
      },
    })

    console.log('\n📊 Final state:')
    console.log(
      `  - Total budget team members: ${updatedBudget?.budgetTeamMembers.length || 0}`
    )
    console.log(
      `  - Active protocol team members: ${activeProtocolTeam.length}`
    )
  } catch (error) {
    console.error('❌ Synchronization failed:', error)
    throw error
  }
}

/**
 * Shows current database state related to team member synchronization
 */
async function showStatus(): Promise<void> {
  console.log('📊 Current database state:\n')

  try {
    const ongoingProtocols = await prisma.protocol.count({
      where: { state: ProtocolState.ON_GOING },
    })

    const approvedBudgets = await prisma.anualBudget.count({
      where: { state: AnualBudgetState.APPROVED },
    })

    const currentYearBudgets = await prisma.anualBudget.count({
      where: {
        state: AnualBudgetState.APPROVED,
        year: new Date().getFullYear(),
      },
    })

    const totalTeamMembers = await prisma.anualBudgetTeamMember.count()
    const executions = await prisma.execution.count()

    console.log(`📈 Statistics:`)
    console.log(`  - Ongoing protocols: ${ongoingProtocols}`)
    console.log(`  - Approved budgets (all years): ${approvedBudgets}`)
    console.log(
      `  - Approved budgets (${new Date().getFullYear()}): ${currentYearBudgets}`
    )
    console.log(`  - Total budget team members: ${totalTeamMembers}`)
    console.log(`  - Total executions: ${executions}`)
  } catch (error) {
    console.error('❌ Status check failed:', error)
    throw error
  }
}

async function main() {
  const args = process.argv.slice(2)
  const command = args[0]
  const param = args[1]

  switch (command) {
    case 'analyze':
      const year = param ? parseInt(param) : new Date().getFullYear()
      await analyzeTeamMemberSync(year)
      break

    case 'test':
      if (!param) {
        console.error('❌ Protocol ID required for test command')
        console.log(
          'Usage: npx tsx src/migrations/test-team-sync.ts test <protocol-id>'
        )
        process.exit(1)
      }
      await testSingleProtocolSync(param)
      break

    case 'sync-one':
      if (!param) {
        console.error('❌ Protocol ID required for sync-one command')
        console.log(
          'Usage: npx tsx src/migrations/test-team-sync.ts sync-one <protocol-id>'
        )
        process.exit(1)
      }
      await syncSingleProtocol(param)
      break

    case 'sync':
      const syncYear = param ? parseInt(param) : new Date().getFullYear()
      await runBulkSync(syncYear)
      break

    case 'status':
      await showStatus()
      break

    default:
      console.log('🔧 Team Member Synchronization Test Tool\n')
      console.log(
        'Usage: npx tsx src/migrations/test-team-sync.ts [command] [options]\n'
      )
      console.log('Commands:')
      console.log(
        '  analyze [year]     - Analyze synchronization needs (default: current year)'
      )
      console.log(
        '  test <protocol-id> - Test synchronization simulation on a specific protocol'
      )
      console.log(
        '  sync-one <protocol-id> - Perform actual synchronization on a specific protocol'
      )
      console.log(
        '  sync [year]        - Run bulk synchronization simulation (default: current year)'
      )
      console.log('  status             - Show current database state')
      console.log('')
      console.log(
        'Note: Only sync-one performs actual changes. test and sync run in safe simulation mode.'
      )
      console.log('\nExamples:')
      console.log('  npx tsx src/migrations/test-team-sync.ts analyze')
      console.log('  npx tsx src/migrations/test-team-sync.ts analyze 2024')
      console.log(
        '  npx tsx src/migrations/test-team-sync.ts test 507f1f77bcf86cd799439011'
      )
      console.log(
        '  npx tsx src/migrations/test-team-sync.ts sync-one 507f1f77bcf86cd799439011'
      )
      console.log('  npx tsx src/migrations/test-team-sync.ts sync')
      console.log('  npx tsx src/migrations/test-team-sync.ts status')
      break
  }
}

main()
  .catch((e) => {
    console.error('💥 Script failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
