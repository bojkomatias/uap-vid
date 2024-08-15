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
  try {
    console.log('🚀🚀🚀 PREPARING FOR LIFTOFF: INSERTING INDEXES! 🚀🚀🚀')
    await InsertIndexes()

    console.log('💼💼💼 CAREER DAY INCOMING: INSERTING CAREERS! 💼💼💼')
    await CareersInsert()

    console.log("📧📧📧 YOU'VE GOT MAIL: INSERTING EMAILS! 📧📧📧")
    await EmailsInsert()

    console.log(
      '🎓💰🎓 ACADEMIC BUDGETING 101: INDEXING ACADEMIC UNIT BUDGETS! 🎓💰🎓'
    )
    await AcademicUnitBudgetsToIndexes()

    console.log(
      '🤝🤝🤝 DIPLOMATIC MISSION: ESTABLISHING ACADEMIC UNIT PROTOCOL RELATION! 🤝🤝🤝'
    )
    await AcademicUnitProtocolRelation()

    console.log('💸💸💸 SHOW ME THE MONEY: INDEXING ANNUAL BUDGET! 💸💸💸')
    await AnualBudgetToIndexes()

    console.log(
      '💳💳💳 EXPENSE REPORT EXTRAVAGANZA: INDEXING BUDGET EXPENSES! 💳💳💳'
    )
    await BudgetExpensesToIndexes()

    console.log(
      '📜👔📜 CAREER PROTOCOL INITIATED: SETTING PROTOCOL CAREER RELATION! 📜👔📜'
    )
    await ProtocolCareerRelation()

    console.log(
      '👥🏆👥 TEAM BUILDING EXERCISE: INDEXING TEAM MEMBER CATEGORIES! 👥🏆👥'
    )
    await TeamMemberCategoryToIndexes()
  } catch (error) {
    console.error('An error occurred:', error)
  } finally {
    //await client.close()
    console.log('Connection closed')
  }
}

main()
