import mongodb from 'mongodb'
import { ObjectId } from 'mongodb'
import 'dotenv/config'
const uri = process.env.MONGO_URI
const MongoClient = mongodb.MongoClient
const client = new MongoClient(uri)

function getCollection(collection, db = process.env.DATABASE_NAME) {
  return client.db(db).collection(collection)
}
/**This script adds the amountIndex field in the Expenses array, inside the Budget of a Protocol.
 -Needs a little refactoring.
 */

export default async function main() {
  try {
    await client.connect().then(async () => {
      console.log(
        'Connected successfully to the server || BudgetExpensesToIndexes'
      )

      const indexes_collection = getCollection('Index')
      const indexes = await indexes_collection.find().toArray()
      const indexes_latest_values = indexes.map((idx) => {
        return { unit: idx.unit, latest_value: idx.values.at(-1) }
      })

      const latest_fca_price = indexes_latest_values.find(
        (i) => i.unit === 'FCA'
      )?.latest_value?.price
      const latest_fmr_price = indexes_latest_values.find(
        (i) => i.unit === 'FMR'
      )?.latest_value?.price

      const protocols_collection = getCollection('Protocol')
      const protocols = await protocols_collection.find().toArray()

      const updatedProtocols = protocols.map((protocol) => ({
        protocol_id: protocol._id,
        budget: protocol.sections.budget?.expenses.map((expense) => ({
          ...expense,
          data: expense.data.map(({ amount, ...data }) => {
            return {
              ...data,
              amountIndex: {
                FCA: amount / latest_fca_price,
                FMR: amount / latest_fmr_price,
              },
            }
          }),
        })),
      }))

      console.log(updatedProtocols[2])

      for (const protocol of updatedProtocols) {
        try {
          const result = await protocols_collection.updateOne(
            { _id: new ObjectId(protocol.protocol_id) },
            {
              $set: {
                'sections.budget.expenses': protocol.budget,
              },
            }
          )
          console.log(
            `Updated protocol ${protocol.protocol_id}: ${result.modifiedCount} document modified`
          )
        } catch (error) {
          console.error(
            `Error updating protocol ${protocol.protocol_id}:`,
            error
          )
        }
      }
    })
  } catch (error) {
    console.error(
      'An error occurred while updating budget expenses in protocol:',
      error
    )
  } finally {
    await client.close()
    console.log('Connection closed || BudgetExpensesToIndexes')
  }
}

main()
