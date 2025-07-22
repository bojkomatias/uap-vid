import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
import path from 'path'

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

interface OldExecution {
  id?: string
  amount?: number
  amountIndex?: {
    FCA: number
    FMR: number
  }
  date?: Date | { $date: string }
  academicUnitId: string
  createdAt?: Date | { $date: string }
  updatedAt?: Date | { $date: string }
}

interface OldBudgetItem {
  type: string
  detail: string
  amount?: number
  remaining?: number
  amountIndex: {
    FCA: number
    FMR: number
  }
  remainingIndex: {
    FCA: number
    FMR: number
  }
  executions: OldExecution[]
}

interface OldAnualBudget {
  _id: { $oid: string }
  protocolId: { $oid: string }
  budgetItems: OldBudgetItem[]
  budgetTeamMembers?: any[]
  createdAt: { $date: string }
  updatedAt: { $date: string }
}

// Helper function to convert MongoDB date format to JavaScript Date
function convertMongoDate(
  mongoDate: Date | { $date: string } | undefined
): Date {
  if (!mongoDate) {
    return new Date()
  }

  if (typeof mongoDate === 'object' && '$date' in mongoDate) {
    return new Date(mongoDate.$date)
  }

  if (mongoDate instanceof Date) {
    return mongoDate
  }

  return new Date()
}

async function migrateExecutions() {
  console.log('🚀 Starting Execution migration...')

  try {
    // Step 1: Get all AnualBudgets using Prisma ORM for basic info
    console.log('📊 Fetching annual budgets...')
    const anualBudgets = await prisma.anualBudget.findMany({
      include: {
        budgetItems: true,
        budgetTeamMembers: true,
        protocol: true,
      },
    })

    console.log(`Found ${anualBudgets.length} annual budgets to process`)

    let totalExecutionsCreated = 0
    let budgetsProcessed = 0

    // Step 2: Process each annual budget
    for (const budget of anualBudgets) {
      console.log(
        `\n📋 Processing budget ${budget.id} (${budgetsProcessed + 1}/${anualBudgets.length})`
      )

      let budgetExecutionsCreated = 0

      // Step 3: Process Budget Items and their executions (from embedded structure)
      console.log('  📝 Processing embedded budget items...')

      // Get the raw budget with embedded budget items
      const rawBudget = (await prisma.$runCommandRaw({
        find: 'AnualBudget',
        filter: { _id: { $oid: budget.id } },
      })) as any

      const budgetData = rawBudget.cursor?.firstBatch?.[0]

      if (budgetData?.budgetItems && budgetData.budgetItems.length > 0) {
        console.log(
          `    📝 Found ${budgetData.budgetItems.length} embedded budget items`
        )

        for (
          let itemIndex = 0;
          itemIndex < budgetData.budgetItems.length;
          itemIndex++
        ) {
          const budgetItem = budgetData.budgetItems[itemIndex]

          if (budgetItem.executions && budgetItem.executions.length > 0) {
            console.log(
              `    💰 Found ${budgetItem.executions.length} executions for budget item "${budgetItem.detail}"`
            )

            // Find or create the corresponding BudgetItem in the new structure
            let budgetItemRecord = await prisma.anualBudgetItem.findFirst({
              where: {
                anualBudgetId: budget.id,
                type: budgetItem.type,
                detail: budgetItem.detail,
              },
            })

            if (!budgetItemRecord) {
              // Create the budget item if it doesn't exist
              budgetItemRecord = await prisma.anualBudgetItem.create({
                data: {
                  type: budgetItem.type,
                  detail: budgetItem.detail,
                  amount: budgetItem.amount,
                  remaining: budgetItem.remaining,
                  amountIndex: budgetItem.amountIndex,
                  remainingIndex: budgetItem.remainingIndex,
                  anualBudgetId: budget.id,
                  createdAt: convertMongoDate(budgetData.createdAt),
                  updatedAt: convertMongoDate(budgetData.updatedAt),
                },
              })
            }

            // Create new Execution records for each embedded execution
            for (const execution of budgetItem.executions) {
              const newExecution = await prisma.execution.create({
                data: {
                  amount: execution.amount,
                  amountIndex: execution.amountIndex || undefined,
                  date: convertMongoDate(execution.date),
                  protocolId: budget.protocolId,
                  anualBudgetId: budget.id,
                  academicUnitId: execution.academicUnitId,
                  budgetItemId: budgetItemRecord.id,
                  teamMemberBudgetId: null,
                  createdAt: convertMongoDate(execution.createdAt),
                  updatedAt: convertMongoDate(execution.updatedAt),
                },
              })

              budgetExecutionsCreated++
              totalExecutionsCreated++
            }
          } else {
            console.log(
              `    💰 Found 0 executions for budget item "${budgetItem.detail}"`
            )
          }
        }
      }

      // Step 4: Process Team Member Budgets and their executions (from separate documents)
      if (budget.budgetTeamMembers && budget.budgetTeamMembers.length > 0) {
        console.log(
          `  👥 Processing ${budget.budgetTeamMembers.length} team member budgets...`
        )

        for (const teamMemberBudget of budget.budgetTeamMembers) {
          // Get the raw team member budget with executions
          const rawTeamMemberBudget = (await prisma.$runCommandRaw({
            find: 'AnualBudgetTeamMember',
            filter: { _id: { $oid: teamMemberBudget.id } },
          })) as any

          if (rawTeamMemberBudget.cursor?.firstBatch?.[0]?.executions) {
            const executions = rawTeamMemberBudget.cursor.firstBatch[0]
              .executions as OldExecution[]

            console.log(
              `    👤 Found ${executions.length} executions for team member budget ${teamMemberBudget.id}`
            )

            // Create new Execution records for each embedded execution
            for (const execution of executions) {
              const newExecution = await prisma.execution.create({
                data: {
                  amount: execution.amount,
                  amountIndex: execution.amountIndex || undefined,
                  date: convertMongoDate(execution.date),
                  protocolId: budget.protocolId,
                  anualBudgetId: budget.id,
                  academicUnitId: execution.academicUnitId,
                  budgetItemId: null,
                  teamMemberBudgetId: teamMemberBudget.id,
                  createdAt: convertMongoDate(execution.createdAt),
                  updatedAt: convertMongoDate(execution.updatedAt),
                },
              })

              budgetExecutionsCreated++
              totalExecutionsCreated++
            }
          } else {
            console.log(
              `    👤 Found 0 executions for team member budget ${teamMemberBudget.id}`
            )
          }
        }
      }

      console.log(
        `  ✅ Created ${budgetExecutionsCreated} executions for budget ${budget.id}`
      )
      budgetsProcessed++
    }

    console.log(`\n🎉 Migration completed successfully!`)
    console.log(`📊 Summary:`)
    console.log(`  - Budgets processed: ${budgetsProcessed}`)
    console.log(`  - Total executions created: ${totalExecutionsCreated}`)

    // Step 5: Verification
    console.log(`\n🔍 Verifying migration...`)
    const totalNewExecutions = await prisma.execution.count()
    console.log(`  - Total executions in new model: ${totalNewExecutions}`)

    if (totalNewExecutions === totalExecutionsCreated) {
      console.log(
        `  ✅ Verification successful: All executions migrated correctly`
      )
    } else {
      console.log(
        `  ⚠️  Warning: Execution count mismatch. Expected: ${totalExecutionsCreated}, Found: ${totalNewExecutions}`
      )
    }
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  }
}

async function cleanupOldExecutions() {
  console.log('\n🧹 Starting cleanup of old embedded executions...')

  try {
    // Remove executions arrays from embedded budgetItems in AnualBudget
    console.log('🗑️  Removing executions from embedded budget items...')
    await prisma.$runCommandRaw({
      update: 'AnualBudget',
      updates: [
        {
          q: {},
          u: { $unset: { 'budgetItems.$[].executions': '' } },
          multi: true,
        },
      ],
    })

    // Remove executions arrays from embedded budgetTeamMembers in AnualBudget
    console.log('🗑️  Removing executions from embedded team member budgets...')
    await prisma.$runCommandRaw({
      update: 'AnualBudget',
      updates: [
        {
          q: {},
          u: { $unset: { 'budgetTeamMembers.$[].executions': '' } },
          multi: true,
        },
      ],
    })

    // Also clean up any separate AnualBudgetItem and AnualBudgetTeamMember documents if they exist
    console.log(
      '🗑️  Removing executions from separate budget item documents...'
    )
    await prisma.$runCommandRaw({
      update: 'AnualBudgetItem',
      updates: [
        {
          q: {},
          u: { $unset: { executions: '' } },
          multi: true,
        },
      ],
    })

    console.log(
      '🗑️  Removing executions from separate team member budget documents...'
    )
    await prisma.$runCommandRaw({
      update: 'AnualBudgetTeamMember',
      updates: [
        {
          q: {},
          u: { $unset: { executions: '' } },
          multi: true,
        },
      ],
    })

    console.log('✅ Cleanup completed successfully!')
  } catch (error) {
    console.error('❌ Cleanup failed:', error)
    throw error
  }
}

async function rollbackMigration() {
  console.log('🔄 Rolling back migration...')

  try {
    const executionCount = await prisma.execution.count()
    console.log(`Found ${executionCount} executions to remove`)

    if (executionCount > 0) {
      await prisma.execution.deleteMany({})
      console.log('✅ All executions removed successfully')
    } else {
      console.log('ℹ️  No executions found to remove')
    }
  } catch (error) {
    console.error('❌ Rollback failed:', error)
    throw error
  }
}

async function main() {
  const args = process.argv.slice(2)
  const command = args[0]

  switch (command) {
    case 'migrate':
      await migrateExecutions()
      break

    case 'cleanup':
      await cleanupOldExecutions()
      break

    case 'migrate-and-cleanup':
      await migrateExecutions()
      await cleanupOldExecutions()
      break

    case 'rollback':
      await rollbackMigration()
      break

    case 'verify':
      const executionCount = await prisma.execution.count()
      const budgetCount = await prisma.anualBudget.count()
      console.log(`📊 Current state:`)
      console.log(`  - Total executions: ${executionCount}`)
      console.log(`  - Total annual budgets: ${budgetCount}`)
      break

    default:
      console.log('Usage: node migration-script.js [command]')
      console.log('Commands:')
      console.log('  migrate              - Migrate executions to new model')
      console.log('  cleanup              - Remove old embedded executions')
      console.log('  migrate-and-cleanup  - Run both migration and cleanup')
      console.log(
        '  rollback             - Remove all new executions (rollback)'
      )
      console.log('  verify               - Check current state')
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
