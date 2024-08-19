import { MongoClient } from 'mongodb'
import 'dotenv/config'

const uri = process.env.MONGO_URI
const client = new MongoClient(uri)

function getCollection(collection, db = 'main') {
  return client.db(db).collection(collection)
}

export default async function main() {
  try {
    await client.connect().then(async () => {
      console.log('Connected successfully to server || IndexesInsert')

      const indexes_collection = getCollection('Index')

      await indexes_collection.deleteMany({})

      const now = new Date() // Current date and time

      const FCA = await indexes_collection.insertOne({
        unit: 'FCA',
        values: [{ from: now, to: null, price: 4500 }],
      })

      const FMR = await indexes_collection.insertOne({
        unit: 'FMR',
        values: [{ from: now, to: null, price: 4500 }],
      })

      console.log('Inserted indexes:', FCA.insertedId, FMR.insertedId)
    })
  } catch (error) {
    console.error('An error occurred while inserting indexes:', error)
  } finally {
    await client.close()
    console.log('Connection closed || IndexesInsert')
  }
}

main().catch(console.error)
