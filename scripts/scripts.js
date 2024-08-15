import mongodb from 'mongodb'
import 'dotenv/config'
import InsertIndexes from './indexes_insert.js'
import CareersInsert from './careers_insert.js'
import EmailsInsert from './emails_insert.js'
import AcademicUnitBudgetsToIndexes from './academic-unit-budgets-to-indexes.js'
import AcademicUnitProtocolRelation from './academic-unit-protocol-relation.js'
import AnualBudgetToIndexes from './anual-budget-to-indexes.js'
import BudgetExpensesToIndexes from './budget-expenses-to-indexes.js'
import ProtocolCareerRelation from './protocol-career-relation.js'
import TeamMemberCategoryToIndexes from './team-member-category-to-indexes.js'

const MongoClient = mongodb.MongoClient
const uri = process.env.MONGO_URI
//const client = new MongoClient(uri)

console.log(uri)

function sleep(ms) {
  console.log(
    '🕒🕒🕒🕒🕒🕒🕒🕒🕒🕒🕒🕒🕒🕒🕒🕒🕒🕒🕒🕒🕒🕒🕒🕒🕒🕒🕒🕒🕒🕒🕒🕒🕒🕒'
  )
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**This script adds the academicUnitIds array in the Protocol object. This field is necessary for Prisma to create a virtual relation between Protocol and AcademicUnit.
 -Needs a little refactoring.
 */
async function main() {
  await InsertIndexes()
  await sleep(2000)
  await CareersInsert()
  await sleep(2000)
  await EmailsInsert()
  await sleep(2000)
  await AcademicUnitBudgetsToIndexes()
  await sleep(2000)
  await AcademicUnitProtocolRelation()
  await sleep(2000)
  await AnualBudgetToIndexes()
  await sleep(2000)
  await BudgetExpensesToIndexes()
  await sleep(2000)
  await ProtocolCareerRelation()
  await sleep(2000)
  await TeamMemberCategoryToIndexes()
}

await main()
