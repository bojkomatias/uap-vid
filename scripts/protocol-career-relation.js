import mongodb from 'mongodb'
import { ObjectId } from 'mongodb'
import 'dotenv/config'
const uri = process.env.MONGO_URI
const MongoClient = mongodb.MongoClient
const client = new MongoClient(uri)

function getCollection(collection, db = process.env.DATABASE_NAME) {
  return client.db(db).collection(collection)
}
/**This script adds the relation between Protocol and Career (adding careerId to Protocol).
 */

export default async function main() {
  try {
    await client.connect().then(async () => {
      console.log('Connected successfully to MongoDB || ProtocolCareerRelation')

      const protocol_collection = getCollection('Protocol')
      const protocols = await protocol_collection.find().toArray()

      const career_collection = getCollection('Career')
      const careers = await career_collection.find().toArray()

      const career_id_dictionary = careers.reduce((acc, ac) => {
        acc[ac.name] = ac._id
        return acc
      }, {})

      const updated_protocols = protocols.map((protocol) => ({
        protocol_id: protocol._id,
        careerId: career_id_dictionary[protocol.sections.identification.career],
      }))

      for (const protocol of updated_protocols) {
        try {
          const result = await protocol_collection.updateOne(
            { _id: new ObjectId(protocol.protocol_id) },
            {
              $set: {
                'sections.identification.careerId': protocol.careerId,
              },
            }
          )
          if (result.modifiedCount > 1) {
            console.log(
              `Updated protocol ${protocol.protocol_id}: ${result.modifiedCount} document modified, career related through ObjectId`
            )
          }
        } catch (error) {
          console.error(
            `Error updating protocol ${protocol.protocol_id}:`,
            error
          )
        }
      }
    })
  } catch (error) {
    console.error('An error occurred while updating protocols:', error)
  } finally {
    await client.close()
    console.log('Connection closed || ProtocolCareerRelation')
  }
}
