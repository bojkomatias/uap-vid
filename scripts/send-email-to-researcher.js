//This script will send a notification via email when there are team members to be confirmed in protocol
import { MongoClient } from 'mongodb'
import 'dotenv/config'

const uri = process.env.MONGO_URI
const client = new MongoClient(uri)

function getCollection(collection, db = process.env.DATABASE_NAME) {
  return client.db(db).collection(collection)
}

export default async function main() {
  try {
    await client.connect().then(async () => {
      console.log('Connected successfully to MongoDB || Email Notifications')

      const protocols_collection = getCollection('Protocol')

      const now = new Date() // Current date and time

      const protocol_team_section = (
        await protocols_collection.find().toArray()
      ).map((p) => {
        return p.sections.identification.team
      })

      console.dir(protocol_team_section, { maxArrayLength: Infinity })
    })
  } catch (error) {
    console.error('An error occurred while sending notification emails:', error)
  } finally {
    await client.close()
    console.log('Connection closed || Email Notifications')
  }
}

await main()
