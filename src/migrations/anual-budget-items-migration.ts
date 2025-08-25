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

interface EmbeddedBudgetItem {
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
  executions?: any[]
}

interface OldAnualBudget {
  _id: { $oid: string }
  protocolId: { $oid: string }
  budgetItems: EmbeddedBudgetItem[]
  createdAt: { $date: string }
  updatedAt: { $date: string }
  state?: string
  year?: number
  academicUnitsIds?: any[]
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

async function migrateBudgetItems() {
  console.log('🚀 Starting Budget Items migration...')

  try {
    // Step 1: Get all AnualBudgets with embedded budget items directly from MongoDB
    console.log('📊 Fetching annual budgets with embedded items...')

    const rawBudgets = (await prisma.$runCommandRaw({
      find: 'AnualBudget',
      filter: {},
    })) as any

    const anualBudgets = rawBudgets.cursor.firstBatch as OldAnualBudget[]

    console.log(`Found ${anualBudgets.length} annual budgets to process`)

    let totalBudgetItemsCreated = 0
    let budgetsProcessed = 0

    // Step 2: Process each annual budget
    for (const budget of anualBudgets) {
      console.log(
        `\n📋 Processing budget ${budget._id.$oid} (${budgetsProcessed + 1}/${anualBudgets.length})`
      )

      let budgetItemsCreated = 0

      // Step 3: Process all embedded budget items
      if (budget.budgetItems && budget.budgetItems.length > 0) {
        console.log(
          `  📝 Processing ${budget.budgetItems.length} embedded budget items...`
        )

        for (
          let itemIndex = 0;
          itemIndex < budget.budgetItems.length;
          itemIndex++
        ) {
          const budgetItem = budget.budgetItems[itemIndex]

          console.log(
            `    💰 Processing budget item "${budgetItem.detail}" (type: ${budgetItem.type})`
          )

          // Check if this budget item already exists as a separate document
          const existingBudgetItem = await prisma.anualBudgetItem.findFirst({
            where: {
              anualBudgetId: budget._id.$oid,
              type: budgetItem.type,
              detail: budgetItem.detail,
            },
          })

          if (existingBudgetItem) {
            console.log(`      ℹ️  Budget item already exists, skipping...`)
            continue
          }

          // Create the budget item as a separate document
          const newBudgetItem = await prisma.anualBudgetItem.create({
            data: {
              type: budgetItem.type,
              detail: budgetItem.detail,
              amount: budgetItem.amount,
              remaining: budgetItem.remaining,
              amountIndex: budgetItem.amountIndex,
              remainingIndex: budgetItem.remainingIndex,
              anualBudgetId: budget._id.$oid,
              createdAt: convertMongoDate(budget.createdAt),
              updatedAt: convertMongoDate(budget.updatedAt),
            },
          })

          console.log(
            `      ✅ Created AnualBudgetItem with ID: ${newBudgetItem.id}`
          )
          budgetItemsCreated++
          totalBudgetItemsCreated++
        }
      } else {
        console.log(`  📝 No budget items found in this budget`)
      }

      console.log(
        `  ✅ Created ${budgetItemsCreated} budget items for budget ${budget._id.$oid}`
      )
      budgetsProcessed++
    }

    console.log(`\n🎉 Budget Items migration completed successfully!`)
    console.log(`📊 Summary:`)
    console.log(`  - Budgets processed: ${budgetsProcessed}`)
    console.log(`  - Total budget items created: ${totalBudgetItemsCreated}`)

    // Step 4: Verification
    console.log(`\n🔍 Verifying migration...`)
    const totalBudgetItems = await prisma.anualBudgetItem.count()
    const budgetsWithItems = await prisma.anualBudget.count({
      where: {
        budgetItems: {
          some: {},
        },
      },
    })

    console.log(`  - Total AnualBudgetItem documents: ${totalBudgetItems}`)
    console.log(`  - Budgets with separate budget items: ${budgetsWithItems}`)

    // Count embedded items for comparison
    let totalEmbeddedItems = 0
    for (const budget of anualBudgets) {
      if (budget.budgetItems) {
        totalEmbeddedItems += budget.budgetItems.length
      }
    }

    console.log(`  - Total embedded items found: ${totalEmbeddedItems}`)

    if (totalBudgetItems >= totalBudgetItemsCreated) {
      console.log(
        `  ✅ Migration successful: All budget items are now separate documents`
      )
    } else {
      console.log(
        `  ⚠️  Warning: Some budget items may not have been migrated properly`
      )
    }
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  }
}

async function cleanupEmbeddedBudgetItems() {
  console.log('\n🧹 Starting cleanup of embedded budget items...')

  try {
    // Remove budgetItems arrays from AnualBudget documents
    console.log(
      '🗑️  Removing embedded budgetItems arrays from AnualBudget documents...'
    )

    const result = (await prisma.$runCommandRaw({
      update: 'AnualBudget',
      updates: [
        {
          q: {},
          u: { $unset: { budgetItems: '' } },
          multi: true,
        },
      ],
    })) as any

    console.log(
      `✅ Cleanup completed successfully! Modified ${result.nModified || result.modifiedCount || 'unknown'} documents`
    )
  } catch (error) {
    console.error('❌ Cleanup failed:', error)
    throw error
  }
}

async function rollbackBudgetItemsMigration() {
  console.log('🔄 Rolling back budget items migration...')

  try {
    const budgetItemCount = await prisma.anualBudgetItem.count()
    console.log(`Found ${budgetItemCount} budget items to remove`)

    if (budgetItemCount > 0) {
      await prisma.anualBudgetItem.deleteMany({})
      console.log('✅ All separate budget items removed successfully')
    } else {
      console.log('ℹ️  No separate budget items found to remove')
    }
  } catch (error) {
    console.error('❌ Rollback failed:', error)
    throw error
  }
}

async function verifyBudgetItemsStructure() {
  console.log('🔍 Verifying budget items structure...')

  try {
    // Count separate budget items
    const separateBudgetItems = await prisma.anualBudgetItem.count()

    // Count budgets
    const totalBudgets = await prisma.anualBudget.count()

    // Get a sample budget to check for embedded items
    const sampleBudget = (await prisma.$runCommandRaw({
      find: 'AnualBudget',
      filter: {},
      limit: 1,
    })) as any

    const hasEmbeddedItems =
      sampleBudget.cursor?.firstBatch?.[0]?.budgetItems !== undefined

    console.log(`📊 Current structure:`)
    console.log(`  - Total budgets: ${totalBudgets}`)
    console.log(`  - Separate budget items: ${separateBudgetItems}`)
    console.log(`  - Sample budget has embedded items: ${hasEmbeddedItems}`)

    // Show some budget items details
    if (separateBudgetItems > 0) {
      const sampleItems = await prisma.anualBudgetItem.findMany({
        take: 3,
        include: {
          anualBudget: {
            select: {
              id: true,
              year: true,
              state: true,
            },
          },
        },
      })

      console.log(`\n📝 Sample budget items:`)
      sampleItems.forEach((item, index) => {
        console.log(
          `  ${index + 1}. "${item.detail}" (${item.type}) - Budget: ${item.anualBudgetId}`
        )
      })
    }
  } catch (error) {
    console.error('❌ Verification failed:', error)
    throw error
  }
}

async function main() {
  const args = process.argv.slice(2)
  const command = args[0]

  switch (command) {
    case 'migrate':
      await migrateBudgetItems()
      break

    case 'cleanup':
      await cleanupEmbeddedBudgetItems()
      break

    case 'migrate-and-cleanup':
      await migrateBudgetItems()
      await cleanupEmbeddedBudgetItems()
      break

    case 'rollback':
      await rollbackBudgetItemsMigration()
      break

    case 'verify':
      await verifyBudgetItemsStructure()
      break

    default:
      console.log('Usage: node budget-items-migration.js [command]')
      console.log('Commands:')
      console.log(
        '  migrate              - Migrate embedded budget items to separate documents'
      )
      console.log(
        '  cleanup              - Remove embedded budgetItems arrays from AnualBudget'
      )
      console.log('  migrate-and-cleanup  - Run both migration and cleanup')
      console.log(
        '  rollback             - Remove all separate budget items (rollback)'
      )
      console.log(
        '  verify               - Check current budget items structure'
      )
      console.log('')
      console.log('Examples:')
      console.log(
        '  node budget-items-migration.js migrate     # Just migrate items'
      )
      console.log(
        '  node budget-items-migration.js verify      # Check current state'
      )
      console.log(
        '  node budget-items-migration.js cleanup     # Remove embedded arrays'
      )
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
