import mongodb from 'mongodb'
import 'dotenv/config'
import AcademicUnitBudgetsToIndexes from './academic-unit-budgets-to-indexes'
import AcademicUnitProtocolRelation from './academic-unit-protocol-relation'
import AnualBudgetToIndexes from './anual-budget-to-indexes'
import BudgetExpensesToIndexes from './budget-expenses-to-indexes'
import ProtocolCareerRelation from './protocol-career-relation'
import TeamMemberCategoryToIndexes from './team-member-category-to-indexes'

const MongoClient = mongodb.MongoClient
const uri = process.env.MONGO_URI
//const client = new MongoClient(uri)

console.log(uri)

/**This script adds the academicUnitIds array in the Protocol object. This field is necessary for Prisma to create a virtual relation between Protocol and AcademicUnit.
 -Needs a little refactoring.
 */
async function main() {
  try {
    await AcademicUnitBudgetsToIndexes()
    await AcademicUnitProtocolRelation()
    await AnualBudgetToIndexes()
    await BudgetExpensesToIndexes()
    await ProtocolCareerRelation()
    await TeamMemberCategoryToIndexes()
  } catch (error) {
    console.error('An error occurred:', error)
  } finally {
    //await client.close()
    console.log('Connection closed')
  }
}

main()
