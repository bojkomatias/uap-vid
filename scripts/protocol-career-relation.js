import mongodb from 'mongodb'
import { ObjectId } from 'mongodb'
import 'dotenv/config'
const uri = process.env.MONGO_URI
const MongoClient = mongodb.MongoClient
const client = new MongoClient(uri)

function getCollection(collection, db = 'develop') {
  return client.db(db).collection(collection)
}
/**This script adds the relation between Protocol and Career (adding careerId to Protocol).
 -Needs a little refactoring.
 */

export default async function main() {
  try {
    await client.connect()
    console.log('Connected successfully to MongoDB')

    const protocol_collection = getCollection('Protocol')
    const protocols = await protocol_collection.find().toArray()

    const career_collection = getCollection('Career')
    const careers = await career_collection.find().toArray()

    const career_id_dictionary = careers.reduce((acc, ac) => {
      acc[ac.name] = ac._id
      return acc
    }, {})

    const updated_protocols = protocols.map((protocol) => {
      return {
        ...protocol,
        sections: {
          ...protocol.sections,
          identification: {
            ...protocol.sections.identification,
            careerId:
              career_id_dictionary[protocol.sections.identification.career],
          },
        },
      }
    })

    for (const protocol of updated_protocols) {
      try {
        const result = await protocol_collection.updateOne(
          { _id: new ObjectId(protocol._id) },
          {
            $set: {
              'sections.identification': protocol.sections.identification,
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
  } catch (error) {
    console.error('An error occurred:', error)
  } finally {
    await client.close()
    console.log('Connection closed')
  }
}

main()
