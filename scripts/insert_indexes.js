import mongodb from 'mongodb'
import 'dotenv/config'
const uri = process.env.MONGO_URI
const MongoClient = mongodb.MongoClient
const client = new MongoClient(uri)

function getCollection(collection, db = 'develop') {
  return client.db(db).collection(collection)
}

export default async function main() {
  try {
    await client.connect()

    const FCA = indexes_collection.insertOne({
      unit: 'FCA',
      values: [
        { from: '2024-07-30T21:51:31.986+00:00', to: null, price: 4500 },
      ],
    })
    const FMR = indexes_collection.insertOne({
      unit: 'FCA',
      values: [
        { from: '2024-07-30T21:51:31.986+00:00', to: null, price: 4500 },
      ],
    })

    console.log(FCA, FMR)
  } catch (error) {
    console.error('An error occurred:', error)
  } finally {
    await client.close()
    console.log('Connection closed')
  }
}
main()
