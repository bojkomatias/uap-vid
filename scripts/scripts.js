import 'dotenv/config'
import IndexesInsert from './indexes_insert.js'
import CareersInsert from './careers_insert.js'
import EmailsInsert from './emails_insert.js'
import ReviewQuestionsInsert from './review_questions_insert.js'
import AcademicUnitBudgetsToIndexes from './academic-unit-budgets-to-indexes.js'
import ProtocolAcademicUnitRelation from './protocol-academic-unit-relation.js'
import AnualBudgetToIndexes from './anual-budget-to-indexes.js'
import ProtocolBudgetExpensesToIndexes from './protocol-budget-expenses-to-indexes.js'
import ProtocolCareerRelation from './protocol-career-relation.js'
import TeamMemberCategoryToIndexes from './team-member-category-to-indexes.js'

async function main() {
  await IndexesInsert()
  await CareersInsert()
  await EmailsInsert()
  await ReviewQuestionsInsert()

  await ProtocolBudgetExpensesToIndexes()
  await AcademicUnitBudgetsToIndexes()
  await TeamMemberCategoryToIndexes()
  await AnualBudgetToIndexes()
  await ProtocolAcademicUnitRelation()
  await ProtocolCareerRelation()
}

await main()
