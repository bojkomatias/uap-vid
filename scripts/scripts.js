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

/**This script adds the academicUnitIds array in the Protocol object. This field is necessary for Prisma to create a virtual relation between Protocol and AcademicUnit.
 -Needs a little refactoring.
 */
async function main() {
  await InsertIndexes()
  await CareersInsert()
  await EmailsInsert()

  setTimeout(async () => {
    await AcademicUnitBudgetsToIndexes()
    await AcademicUnitProtocolRelation()
    await AnualBudgetToIndexes()
    await BudgetExpensesToIndexes()
    await ProtocolCareerRelation()
    await TeamMemberCategoryToIndexes()
  }, 15000)
}

await main()
