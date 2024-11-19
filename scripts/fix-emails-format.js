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
      console.log('Connected successfully to MongoDB || FIXEMAILS')

      const users_collection = getCollection('User')

      const users = await users_collection.find().toArray()

      // Update each user's email to lowercase
      for (const user of users) {
        if (user.email) {
          await users_collection.updateOne(
            { _id: user._id },
            { $set: { email: user.email.toLowerCase() } }
          )
        }
      }

      // Verify results
      const remainingUppercase = await users_collection.countDocuments({
        email: { $regex: /[A-Z]/ },
      })
      console.log(
        `Documents with uppercase emails remaining: ${remainingUppercase}`
      )
    })
  } catch (error) {
    console.error('An error occurred while fixing emails:', error)
  } finally {
    await client.close()
    console.log('Connection closed || FIXEMAILS')
  }
}

main()
