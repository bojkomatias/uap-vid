import mongodb from 'mongodb'
import { ObjectId } from 'mongodb'

const MongoClient = mongodb.MongoClient
const uri =
  'mongodb+srv://admin:d8oZb8WbVYtiKUY5@research.kcnnb.mongodb.net/?retryWrites=true&w=majority'
const client = new MongoClient(uri)

/**This script adds the amountIndex field in the Expenses array, inside the Budget of a Protocol.
 -Needs a little refactoring.
 */

function getCollection(collection, db = 'develop') {
  return client.db(db).collection(collection)
}

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

    const protocols_collection = getCollection('Protocol')
    const protocols = await protocols_collection.find().toArray()

    const updatedProtocols = protocols.map((protocol) => {
      return {
        ...protocol,
        sections: {
          ...protocol.sections,
          budget: protocol.sections.budget.expenses.map((expense) => {
            return {
              ...expense,
              data: expense.data.map((data) => {
                return {
                  ...data,
                  amountIndex: {
                    FCA: data.amount / latest_fca_price,
                    FMR: data.amount / latest_fmr_price,
                  },
                }
              }),
            }
          }),
        },
      }
    })

    for (const protocol of updatedProtocols) {
      try {
        const result = await protocols_collection.updateOne(
          { _id: new ObjectId(protocol._id) },
          {
            $set: {
              'sections.budget': protocol.sections.budget,
            },
          }
        )
        console.log(
          `Updated protocol ${protocol._id}: ${result.modifiedCount} document modified`
        )
      } catch (error) {
        console.error(`Error updating protocol ${protocol._id}:`, error)
      }
    }

    console.log(updatedProtocols[0].sections.budget[2].data[0].amountIndex)
  } catch (error) {
    console.error('An error occurred:', error)
  } finally {
    await client.close()
    console.log('Connection closed')
  }
}

main()
