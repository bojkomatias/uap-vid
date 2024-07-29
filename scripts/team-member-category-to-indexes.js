import mongodb from 'mongodb'
import { ObjectId } from 'mongodb'
import sensitive from "./sensitive.json" assert {type: "json"}

const uri = sensitive.mongo_uri
const MongoClient = mongodb.MongoClient
const client = new MongoClient(uri)

function getCollection(collection, db = 'develop') {
  return client.db(db).collection(collection)
}
/**This script adds the amountIndex field in the Category collection.
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

    const team_member_category_collection = getCollection('TeamMemberCategory')
    const team_member_categories = await team_member_category_collection
      .find()
      .toArray()

    const updatedCategories = team_member_categories.map((category) => {
      delete category['category']
      return {
        ...category,
        amountIndex: {
          FCA: category.price.at(-1).price / latest_fca_price,
          FMR: category.price.at(-1).price / latest_fmr_price,
        },
      }
    })

    for (const category of updatedCategories) {
      try {
        const result = await team_member_category_collection.replaceOne(
          { _id: new ObjectId(category._id) },
          category
        )
        console.log(
          `Updated category ${category._id}: ${result.modifiedCount} document modified`
        )
      } catch (error) {
        console.error(`Error updating category ${category._id}:`, error)
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