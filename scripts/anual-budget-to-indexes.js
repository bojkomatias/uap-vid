import mongodb from 'mongodb'
import { ObjectId } from 'mongodb'

const MongoClient = mongodb.MongoClient
const uri =
  'mongodb+srv://admin:d8oZb8WbVYtiKUY5@research.kcnnb.mongodb.net/?retryWrites=true&w=majority'
const client = new MongoClient(uri)

function getCollection(collection, db = 'develop') {
  return client.db(db).collection(collection)
}

/**This script adds the amountIndex field in the budgetItems array, for each document in the AnualBudget collection.
 -Needs a little refactoring.
 */

async function main() {
  try {
    await client.connect()
    console.log('Connected successfully to MongoDB')
    const indexes_collection = getCollection('Index')
    const indexes = await indexes_collection.find().toArray()
    const indexes_latest_values = indexes.map((idx) => {
      return { unit: idx.unit, latest_value: idx.values.at(-1) }
    })
    const latest_fca_price = indexes_latest_values.find((i) => i.unit === 'FCA')
      .latest_value.price
    const latest_fmr_price = indexes_latest_values.find((i) => i.unit === 'FMR')
      .latest_value.price

    const anual_budget_collection = getCollection('AnualBudget')
    const anual_budgets = await anual_budget_collection.find().toArray()

    const updated_anual_budgets = anual_budgets.map((anual_budget) => {
      return {
        ...anual_budget,
        budgetItems: anual_budget.budgetItems?.map((budgetItem) => {
          return {
            ...budgetItem,
            amountIndex: {
              FCA: budgetItem.amount / latest_fca_price,
              FMR: budgetItem.amount / latest_fmr_price,
            },
            remainingIndex: {
              FCA: budgetItem.amount / latest_fca_price,
              FMR: budgetItem.amount / latest_fmr_price,
            },
          }
        }),
      }
    })

    for (const anual_budget of updated_anual_budgets) {
      try {
        const result = await anual_budget_collection.replaceOne(
          { _id: new ObjectId(anual_budget._id) },
          anual_budget
        )
        console.log(
          `Updated anual budget ${anual_budget._id}: ${result.modifiedCount} document modified`
        )
      } catch (error) {
        console.error(`Error updating anual budget ${anual_budget._id}:`, error)
      }
    }
  } catch (error) {
    console.error('An error occurred:', error)
  } finally {
    await client.close()
    console.log('Connection closed')
  }
}

main()
