import { PrismaClient } from '@prisma/client'
import * as dotenv from 'dotenv'
import path from 'path'

// Load environment variables from the project root
dotenv.config({ path: path.resolve(__dirname, './.env') })
dotenv.config({ path: path.resolve(__dirname, './.env.local') })

// Verify DATABASE_URL is available
if (!process.env.DATABASE_URL) {
  console.error('❌ DATABASE_URL environment variable is not set')
  console.log(
    'Please make sure you have a .env file in your project root with DATABASE_URL'
  )
  process.exit(1)
}

const prisma = new PrismaClient()

interface OldAcademicUnitBudget {
  amount?: number // deprecated field
  from: Date | { $date: string }
  to?: Date | { $date: string } | null
  amountIndex: {
    FCA: number
    FMR: number
  }
}

interface OldAcademicUnit {
  _id: { $oid: string }
  name: string
  shortname: string
  budgets: OldAcademicUnitBudget[]
  createdAt?: { $date: string }
  updatedAt?: { $date: string }
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

// Helper function to extract year from a date
function extractYear(date: Date): number {
  return date.getFullYear()
}

// Helper function to determine the budget year based on the "from" date
function determineBudgetYear(fromDate: Date, toDate?: Date | null): number {
  // If we have a toDate, we could use the span to determine the year
  // For now, we'll use the year from the "from" date
  return extractYear(fromDate)
}

// Helper function to get required years (2024 and 2025)
function getRequiredYears(): number[] {
  return [2024, 2025] // Fixed years as per business requirements
}

async function migrateAcademicUnitBudgets() {
  console.log('🚀 Starting AcademicUnit budget migration...')

  try {
    // Define the required years and default budget values
    const REQUIRED_YEARS = getRequiredYears()
    const DEFAULT_AMOUNT_INDEX = { FCA: 20, FMR: 20 }

    console.log(`📅 Required years for all units: ${REQUIRED_YEARS.join(', ')}`)

    // Step 1: Get all AcademicUnits (both with and without embedded budgets)
    console.log('📊 Fetching all academic units...')

    const allAcademicUnits = await prisma.academicUnit.findMany({
      select: {
        id: true,
        name: true,
      },
    })

    console.log(`Found ${allAcademicUnits.length} academic units to process`)

    // Step 2: Get units with embedded budgets
    const rawAcademicUnits = (await prisma.$runCommandRaw({
      find: 'AcademicUnit',
      filter: { budgets: { $exists: true, $ne: [] } },
    })) as any

    const academicUnitsWithBudgets = rawAcademicUnits.cursor?.firstBatch || []
    console.log(
      `  - ${academicUnitsWithBudgets.length} units have embedded budgets`
    )
    console.log(
      `  - ${allAcademicUnits.length - academicUnitsWithBudgets.length} units will get default budgets`
    )

    let totalBudgetsCreated = 0
    let defaultBudgetsCreated = 0
    let unitsProcessed = 0

    // Step 3: Process each academic unit
    for (const unit of allAcademicUnits) {
      console.log(
        `\n🏢 Processing academic unit "${unit.name}" (${unitsProcessed + 1}/${allAcademicUnits.length})`
      )

      let unitBudgetsCreated = 0
      let unitDefaultBudgetsCreated = 0

      // Find if this unit has embedded budgets
      const unitWithBudgets = academicUnitsWithBudgets.find(
        (u: any) => u._id.$oid === unit.id
      )
      // Track which years have been processed for this unit
      const processedYears = new Set<number>()

      if (unitWithBudgets?.budgets && unitWithBudgets.budgets.length > 0) {
        console.log(
          `  💰 Found ${unitWithBudgets.budgets.length} embedded budgets`
        )

        // Group budgets by year to remove duplicates
        const budgetsByYear: { [year: number]: OldAcademicUnitBudget } = {}
        const duplicatesSkipped: { [year: number]: number } = {}

        // First pass: identify duplicates and keep the first occurrence for each year
        for (
          let budgetIndex = 0;
          budgetIndex < unitWithBudgets.budgets.length;
          budgetIndex++
        ) {
          const budget = unitWithBudgets.budgets[budgetIndex]
          const fromDate = convertMongoDate(budget.from)
          const year = determineBudgetYear(
            fromDate,
            budget.to ? convertMongoDate(budget.to) : null
          )

          if (budgetsByYear[year]) {
            // Duplicate found for this year
            duplicatesSkipped[year] = (duplicatesSkipped[year] || 0) + 1
            console.log(
              `    🔄 Duplicate budget found for year ${year}, skipping...`
            )
          } else {
            // First occurrence for this year
            budgetsByYear[year] = budget
          }
        }

        // Report duplicates skipped
        const totalDuplicates = Object.values(duplicatesSkipped).reduce(
          (sum, count) => sum + count,
          0
        )
        if (totalDuplicates > 0) {
          console.log(`    ⚠️  Skipped ${totalDuplicates} duplicate budgets:`)
          Object.entries(duplicatesSkipped).forEach(([year, count]) => {
            console.log(`      Year ${year}: ${count} duplicates`)
          })
        }

        console.log(
          `  📅 Processing ${Object.keys(budgetsByYear).length} unique budgets (by year)`
        )

        // Second pass: process unique budgets
        for (const [yearStr, budget] of Object.entries(budgetsByYear)) {
          const year = parseInt(yearStr)
          const fromDate = convertMongoDate(budget.from)
          const toDate = budget.to ? convertMongoDate(budget.to) : null

          console.log(`    📅 Processing budget for year ${year}`)

          try {
            // Check if budget for this year already exists in the database
            const existingBudget = await prisma.academicUnitBudget.findUnique({
              where: {
                academicUnitId_year: {
                  academicUnitId: unit.id,
                  year: year,
                },
              },
            })

            if (existingBudget) {
              console.log(
                `    ⚠️  Budget for year ${year} already exists in database, skipping...`
              )
              processedYears.add(year)
              continue
            }

            // Create new AcademicUnitBudget record
            const newBudget = await prisma.academicUnitBudget.create({
              data: {
                year: year,
                amountIndex: budget.amountIndex,
                from: fromDate,
                to: toDate,
                academicUnitId: unit.id,
                createdAt:
                  convertMongoDate(unitWithBudgets.createdAt) || new Date(),
                updatedAt:
                  convertMongoDate(unitWithBudgets.updatedAt) || new Date(),
              },
            })

            console.log(`    ✅ Created budget record with ID: ${newBudget.id}`)
            processedYears.add(year)
            unitBudgetsCreated++
            totalBudgetsCreated++
          } catch (error) {
            if (
              error instanceof Error &&
              error.message.includes('Unique constraint')
            ) {
              console.log(
                `    ⚠️  Budget for year ${year} already exists (unique constraint), skipping...`
              )
              processedYears.add(year)
            } else {
              console.error(
                `    ❌ Error creating budget for year ${year}:`,
                error
              )
              throw error
            }
          }
        }
      } else {
        console.log(`  💰 No embedded budgets found`)
      }

      // Step 4: Create default budgets for missing required years
      const missingYears = REQUIRED_YEARS.filter(
        (year) => !processedYears.has(year)
      )

      if (missingYears.length > 0) {
        console.log(
          `  🔧 Creating default budgets for missing years: ${missingYears.join(', ')}`
        )

        for (const year of missingYears) {
          try {
            // Check if budget for this year already exists in the database
            const existingBudget = await prisma.academicUnitBudget.findUnique({
              where: {
                academicUnitId_year: {
                  academicUnitId: unit.id,
                  year: year,
                },
              },
            })

            if (existingBudget) {
              console.log(
                `    ⚠️  Default budget for year ${year} already exists in database, skipping...`
              )
              continue
            }

            // Create default budget for missing year
            const defaultBudget = await prisma.academicUnitBudget.create({
              data: {
                year: year,
                amountIndex: DEFAULT_AMOUNT_INDEX,
                from: new Date(`${year}-01-01`),
                to: new Date(`${year}-12-31`),
                academicUnitId: unit.id,
                createdAt: new Date(),
                updatedAt: new Date(),
              },
            })

            console.log(
              `    🔧 Created default budget for year ${year} with ID: ${defaultBudget.id}`
            )
            unitDefaultBudgetsCreated++
            defaultBudgetsCreated++
            totalBudgetsCreated++
          } catch (error) {
            if (
              error instanceof Error &&
              error.message.includes('Unique constraint')
            ) {
              console.log(
                `    ⚠️  Default budget for year ${year} already exists (unique constraint), skipping...`
              )
            } else {
              console.error(
                `    ❌ Error creating default budget for year ${year}:`,
                error
              )
              throw error
            }
          }
        }
      }
      console.log(
        `  ✅ Created ${unitBudgetsCreated} budget records (${unitDefaultBudgetsCreated} defaults) for "${unit.name}"`
      )
      unitsProcessed++
    }

    console.log(`\n🎉 Migration completed successfully!`)
    console.log(`📊 Summary:`)
    console.log(`  - Academic units processed: ${unitsProcessed}`)
    console.log(`  - Total budget records created: ${totalBudgetsCreated}`)
    console.log(`  - Default budget records created: ${defaultBudgetsCreated}`)
    console.log(
      `  - Each unit should now have at least ${REQUIRED_YEARS.length} budgets for years: ${REQUIRED_YEARS.join(', ')}`
    )

    // Step 5: Verification
    console.log(`\n🔍 Verifying migration...`)
    const totalNewBudgets = await prisma.academicUnitBudget.count()
    console.log(`  - Total budget records in new model: ${totalNewBudgets}`)

    // Check that each unit has at least the required budgets
    const unitsWithBudgetCounts = await prisma.academicUnit.findMany({
      select: {
        id: true,
        name: true,
        budgets: {
          select: {
            year: true,
          },
        },
      },
    })

    console.log(`  - Budget verification by unit:`)
    let allUnitsHaveRequiredBudgets = true
    for (const unit of unitsWithBudgetCounts) {
      const budgetCount = unit.budgets.length
      const years = unit.budgets.map((b) => b.year).sort()
      const hasAllRequiredYears = REQUIRED_YEARS.every((year) =>
        years.includes(year)
      )

      if (!hasAllRequiredYears) {
        const missingRequiredYears = REQUIRED_YEARS.filter(
          (year) => !years.includes(year)
        )
        console.log(
          `    ❌ "${unit.name}": Missing required years: [${missingRequiredYears.join(', ')}], has: [${years.join(', ')}]`
        )
        allUnitsHaveRequiredBudgets = false
      } else {
        console.log(
          `    ✅ "${unit.name}": ${budgetCount} budgets, years: [${years.join(', ')}]`
        )
      }
    }

    // Get detailed statistics
    const budgetsByYear = await prisma.academicUnitBudget.groupBy({
      by: ['year'],
      _count: {
        id: true,
      },
      orderBy: {
        year: 'asc',
      },
    })

    console.log(`\n  - Budget distribution by year:`)
    budgetsByYear.forEach(({ year, _count }) => {
      console.log(`    ${year}: ${_count.id} budgets`)
    })

    if (allUnitsHaveRequiredBudgets) {
      console.log(
        `  ✅ Verification successful: All ${unitsProcessed} units have budgets for required years: ${REQUIRED_YEARS.join(', ')}`
      )
    } else {
      console.log(
        `  ⚠️  Warning: Some units are missing required budgets for years: ${REQUIRED_YEARS.join(', ')}`
      )
    }
  } catch (error) {
    console.error('❌ Migration failed:', error)
    throw error
  }
}

async function cleanupOldBudgets() {
  console.log('\n🧹 Starting cleanup of old embedded budgets...')

  try {
    // Remove budgets arrays from AcademicUnit documents
    console.log('🗑️  Removing embedded budgets from AcademicUnit documents...')
    const result = (await prisma.$runCommandRaw({
      update: 'AcademicUnit',
      updates: [
        {
          q: { budgets: { $exists: true } },
          u: { $unset: { budgets: '' } },
          multi: true,
        },
      ],
    })) as any

    console.log(
      `✅ Cleanup completed! Updated ${result.nModified || 0} documents`
    )
  } catch (error) {
    console.error('❌ Cleanup failed:', error)
    throw error
  }
}

async function rollbackMigration() {
  console.log('🔄 Rolling back migration...')

  try {
    const budgetCount = await prisma.academicUnitBudget.count()
    console.log(`Found ${budgetCount} budget records to remove`)

    if (budgetCount > 0) {
      await prisma.academicUnitBudget.deleteMany({})
      console.log('✅ All budget records removed successfully')
    } else {
      console.log('ℹ️  No budget records found to remove')
    }
  } catch (error) {
    console.error('❌ Rollback failed:', error)
    throw error
  }
}

async function cleanupInvalidYears() {
  console.log(
    '🧹 Starting cleanup of invalid year budgets (not 2024 or 2025)...'
  )

  try {
    const validYears = [2024, 2025]

    console.log(
      `🗑️  Removing budgets with years outside valid range: ${validYears.join(', ')}...`
    )

    // First, let's see what we're about to delete
    const invalidBudgets = await prisma.academicUnitBudget.findMany({
      where: {
        year: {
          notIn: validYears,
        },
      },
      select: {
        id: true,
        year: true,
        academicUnit: {
          select: {
            name: true,
          },
        },
      },
    })

    if (invalidBudgets.length === 0) {
      console.log('✅ No invalid year budgets found')
      return
    }

    console.log(`Found ${invalidBudgets.length} invalid year budgets:`)
    const yearCounts: { [year: number]: number } = {}
    invalidBudgets.forEach((budget) => {
      yearCounts[budget.year] = (yearCounts[budget.year] || 0) + 1
      console.log(`  - ${budget.academicUnit.name}: Year ${budget.year}`)
    })

    console.log('\nYear distribution of invalid budgets:')
    Object.entries(yearCounts)
      .sort(([a], [b]) => parseInt(a) - parseInt(b))
      .forEach(([year, count]) => {
        console.log(`  ${year}: ${count} budgets`)
      })

    // Delete the invalid budgets
    const result = await prisma.academicUnitBudget.deleteMany({
      where: {
        year: {
          notIn: validYears,
        },
      },
    })

    console.log(
      `✅ Cleanup completed! Removed ${result.count} invalid year budget records`
    )

    // Now ensure all units have the required years
    console.log('\n🔧 Ensuring all units have required years after cleanup...')
    await migrateAcademicUnitBudgets()
  } catch (error) {
    console.error('❌ Invalid year cleanup failed:', error)
    throw error
  }
}

async function analyzeCurrentData() {
  console.log('🔍 Analyzing current data structure...')

  try {
    // Check AcademicUnits with embedded budgets
    const rawAcademicUnits = (await prisma.$runCommandRaw({
      find: 'AcademicUnit',
      filter: { budgets: { $exists: true } },
    })) as any

    const unitsWithBudgets = rawAcademicUnits.cursor?.firstBatch || []
    console.log(`📊 Analysis Results:`)
    console.log(
      `  - Academic units with embedded budgets: ${unitsWithBudgets.length}`
    )

    let totalEmbeddedBudgets = 0
    const yearDistribution: { [year: number]: number } = {}

    unitsWithBudgets.forEach((unit: any) => {
      if (unit.budgets && unit.budgets.length > 0) {
        // Count raw embedded budgets
        const rawBudgetCount = unit.budgets.length

        // Group by year to count unique budgets
        const budgetsByYear: { [year: number]: boolean } = {}
        unit.budgets.forEach((budget: any) => {
          const fromDate = convertMongoDate(budget.from)
          const year = extractYear(fromDate)
          budgetsByYear[year] = true
        })

        const uniqueBudgetCount = Object.keys(budgetsByYear).length
        const duplicateCount = rawBudgetCount - uniqueBudgetCount

        totalEmbeddedBudgets += rawBudgetCount

        // Add to year distribution (count unique budgets only)
        Object.keys(budgetsByYear).forEach((yearStr) => {
          const year = parseInt(yearStr)
          yearDistribution[year] = (yearDistribution[year] || 0) + 1
        })

        if (duplicateCount > 0) {
          console.log(
            `    Unit "${unit.name}": ${rawBudgetCount} total, ${uniqueBudgetCount} unique, ${duplicateCount} duplicates`
          )
        }
      }
    })

    console.log(`  - Total embedded budgets: ${totalEmbeddedBudgets}`)
    console.log(`  - Year distribution:`)
    Object.keys(yearDistribution)
      .sort()
      .forEach((year) => {
        console.log(`    ${year}: ${yearDistribution[parseInt(year)]} budgets`)
      })

    // Check existing new budget records
    const existingBudgets = await prisma.academicUnitBudget.count()
    console.log(`  - Existing budget records in new model: ${existingBudgets}`)

    if (existingBudgets > 0) {
      const budgetsByYear = await prisma.academicUnitBudget.groupBy({
        by: ['year'],
        _count: { id: true },
        orderBy: { year: 'asc' },
      })

      console.log(`  - New model year distribution:`)
      budgetsByYear.forEach(({ year, _count }) => {
        console.log(`    ${year}: ${_count.id} records`)
      })

      // Highlight potentially invalid years
      const requiredYears = getRequiredYears()
      const invalidYears = budgetsByYear.filter(
        ({ year }) => !requiredYears.includes(year)
      )

      if (invalidYears.length > 0) {
        console.log(
          `  ⚠️  Invalid years found (should only be ${requiredYears.join(', ')}):`
        )
        invalidYears.forEach(({ year, _count }) => {
          console.log(`    ${year}: ${_count.id} records (should be removed)`)
        })
      }
    }

    // Show required years for context
    const requiredYears = getRequiredYears()
    console.log(`  - Currently required years: ${requiredYears.join(', ')}`)
  } catch (error) {
    console.error('❌ Analysis failed:', error)
    throw error
  }
}

async function main() {
  const args = process.argv.slice(2)
  const command = args[0]

  switch (command) {
    case 'analyze':
      await analyzeCurrentData()
      break

    case 'migrate':
      await migrateAcademicUnitBudgets()
      break

    case 'cleanup':
      await cleanupOldBudgets()
      break

    case 'cleanup-invalid-years':
      await cleanupInvalidYears()
      break

    case 'migrate-and-cleanup':
      await migrateAcademicUnitBudgets()
      await cleanupOldBudgets()
      break

    case 'rollback':
      await rollbackMigration()
      break

    case 'verify':
      const budgetCount = await prisma.academicUnitBudget.count()
      const unitCount = await prisma.academicUnit.count()
      const requiredYears = getRequiredYears()

      console.log(`📊 Current state:`)
      console.log(`  - Total academic unit budget records: ${budgetCount}`)
      console.log(`  - Total academic units: ${unitCount}`)
      console.log(`  - Currently required years: ${requiredYears.join(', ')}`)

      if (budgetCount > 0) {
        const budgetsByYear = await prisma.academicUnitBudget.groupBy({
          by: ['year'],
          _count: { id: true },
          orderBy: { year: 'asc' },
        })

        console.log(`  - Budget distribution by year:`)
        budgetsByYear.forEach(({ year, _count }) => {
          const isRequired = requiredYears.includes(year)
          const marker = isRequired ? '✅' : '  '
          console.log(`    ${marker} ${year}: ${_count.id} budget records`)
        })

        // Check for any remaining embedded budgets
        const rawUnitsWithBudgets = (await prisma.$runCommandRaw({
          find: 'AcademicUnit',
          filter: { budgets: { $exists: true, $ne: [] } },
        })) as any

        const remainingEmbeddedCount =
          rawUnitsWithBudgets.cursor?.firstBatch?.length || 0
        console.log(
          `  - Academic units with remaining embedded budgets: ${remainingEmbeddedCount}`
        )

        // Check if all units have required years
        const unitsWithBudgets = await prisma.academicUnit.findMany({
          select: {
            name: true,
            budgets: {
              select: { year: true },
            },
          },
        })

        const unitsMissingRequiredYears = unitsWithBudgets.filter((unit) => {
          const years = unit.budgets.map((b) => b.year)
          return !requiredYears.every((reqYear) => years.includes(reqYear))
        })

        if (unitsMissingRequiredYears.length > 0) {
          console.log(
            `  ⚠️  Units missing required years: ${unitsMissingRequiredYears.length}`
          )
          unitsMissingRequiredYears.slice(0, 5).forEach((unit) => {
            const years = unit.budgets.map((b) => b.year).sort()
            const missing = requiredYears.filter(
              (reqYear) => !years.includes(reqYear)
            )
            console.log(`    - ${unit.name}: Missing ${missing.join(', ')}`)
          })
          if (unitsMissingRequiredYears.length > 5) {
            console.log(
              `    ... and ${unitsMissingRequiredYears.length - 5} more`
            )
          }
        } else {
          console.log(`  ✅ All units have required years`)
        }
      }
      break

    default:
      console.log('Usage: node academic-unit-budget-migration.js [command]')
      console.log('Commands:')
      console.log('  analyze                 - Analyze current data structure')
      console.log(
        '  migrate                 - Migrate embedded budgets to new model'
      )
      console.log('  cleanup                 - Remove old embedded budgets')
      console.log(
        '  cleanup-invalid-years   - Remove budgets with invalid years (only 2024, 2025 allowed)'
      )
      console.log('  migrate-and-cleanup     - Run both migration and cleanup')
      console.log(
        '  rollback                - Remove all new budget records (rollback)'
      )
      console.log('  verify                  - Check current state')
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
