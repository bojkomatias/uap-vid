import mongodb from 'mongodb'
import { ObjectId } from 'mongodb'
import 'dotenv/config'
const uri = process.env.MONGO_URI

const MongoClient = mongodb.MongoClient
const client = new MongoClient(uri)

function getCollection(collection, db = process.env.DATABASE_NAME) {
  return client.db(db).collection(collection)
}
/**This script adds the amountIndex field in the Budgets array, for each document in the AcademicUnit collection.
 */
export default async function main() {
  try {
    await client.connect().then(async () => {
      console.log(
        'Connected successfully to MongoDB || AcademicUnitBudgetsToIndexes'
      )
      const indexes_collection = getCollection('Index')
      const indexes = await indexes_collection.find().toArray()
      const indexes_latest_values = indexes.map((idx) => {
        return { unit: idx.unit, latest_value: idx.values.at(-1) }
      })
      const latest_fca_price = indexes_latest_values.find(
        (i) => i.unit === 'FCA'
      ).latest_value.price
      const latest_fmr_price = indexes_latest_values.find(
        (i) => i.unit === 'FMR'
      ).latest_value.price

      const academic_units_collection = getCollection('AcademicUnit')
      const academic_units = await academic_units_collection.find().toArray()

      const updated_academic_units_budgets = academic_units.map((ac_unit) => {
        return {
          academic_unit_id: ac_unit._id,
          budgets: ac_unit.budgets?.map(({ amount, ...rest }) => {
            return {
              ...rest,
              amountIndex: {
                FCA: amount / latest_fca_price,
                FMR: amount / latest_fmr_price,
              },
            }
          }),
        }
      })

      console.log(
        isNaN(updated_academic_units_budgets[0].budgets[0].amountIndex.FCA)
      )

      if (
        isNaN(updated_academic_units_budgets[0].budgets[0].amountIndex.FCA) !==
        true
      ) {
        for (const academic_unit_budget of updated_academic_units_budgets) {
          try {
            const result = await academic_units_collection.updateOne(
              { _id: new ObjectId(academic_unit_budget.academic_unit_id) },
              {
                $set: {
                  budgets: academic_unit_budget.budgets,
                },
              }
            )
            if (result.modifiedCount > 0) {
              console.log(
                `Updated academic unit ${academic_unit_budget.academic_unit_id}: ${result.modifiedCount} document modified, amount to indexes.`
              )
            }
          } catch (error) {
            console.error(
              `Error updating academic unit ${academic_unit._id}:`,
              error
            )
          }
        }
      }
    })
  } catch (error) {
    console.error('An error occurred while updating academic unit:', error)
  } finally {
    await client.close()
    console.log('Connection closed || AcademicUnitBudgetsToIndexes')
  }
}

main()
