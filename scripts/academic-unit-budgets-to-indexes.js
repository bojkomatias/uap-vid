import mongodb from 'mongodb'
import { ObjectId } from 'mongodb'
import 'dotenv/config'
const uri = process.env.MONGO_URI

const MongoClient = mongodb.MongoClient
const client = new MongoClient(uri)

function getCollection(collection, db = 'main') {
  return client.db(db).collection(collection)
}
/**This script adds the amountIndex field in the Budgets array, for each document in the AcademicUnit collection.
 -Needs a little refactoring.
 */
export default async function main() {
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

    const ac_units_collection = getCollection('AcademicUnit')
    const ac_units = await ac_units_collection.find().toArray()

    const updated_ac_units = ac_units.map((ac_unit) => {
      return {
        ...ac_unit,
        budgets: ac_unit.budgets?.map((budget) => {
          return {
            ...budget,
            amountIndex: {
              FCA: budget.amount / latest_fca_price,
              FMR: budget.amount / latest_fmr_price,
            },
          }
        }),
      }
    })

    for (const ac_unit of updated_ac_units) {
      try {
        const result = await ac_units_collection.replaceOne(
          { _id: new ObjectId(ac_unit._id) },
          ac_unit
        )
        console.log(
          `Updated academic unit ${ac_unit._id}: ${result.modifiedCount} document modified`
        )
      } catch (error) {
        console.error(`Error updating academic unit ${ac_unit._id}:`, error)
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
