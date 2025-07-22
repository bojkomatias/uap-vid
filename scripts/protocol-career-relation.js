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
      console.log(`Found ${protocols.length} protocols`)

      const career_collection = getCollection('Career')
      const careers = await career_collection.find().toArray()
      console.log(`Found ${careers.length} careers`)

      const career_id_dictionary = careers.reduce((acc, ac) => {
        acc[ac.name] = ac._id
        return acc
      }, {})

      console.log('Available careers:', Object.keys(career_id_dictionary))

      const updated_protocols = protocols.map((protocol) => {
        const careerName = protocol.sections?.identification?.career
        const careerId = career_id_dictionary[careerName]

        if (!careerName) {
          console.log(
            `Protocol ${protocol._id}: No career name found in sections.identification.career`
          )
        } else if (!careerId) {
          console.log(
            `Protocol ${protocol._id}: Career "${careerName}" not found in careers dictionary`
          )
        } else {
          console.log(
            `Protocol ${protocol._id}: Found career "${careerName}" -> ${careerId}`
          )
        }

        return {
          protocol_id: protocol._id,
          careerId: careerId,
          careerName: careerName,
        }
      })

      const protocols_to_update = updated_protocols.filter((p) => p.careerId)
      console.log(`${protocols_to_update.length} protocols will be updated`)

      for (const protocol of protocols_to_update) {
        try {
          const result = await protocol_collection.updateOne(
            { _id: new ObjectId(protocol.protocol_id) },
            {
              $set: {
                'sections.identification.careerId': protocol.careerId,
              },
            }
          )
          if (result.modifiedCount > 0) {
            console.log(
              `Updated protocol ${protocol.protocol_id}: ${result.modifiedCount} document modified, career related through ObjectId`
            )
          } else {
            console.log(
              `Protocol ${protocol.protocol_id}: No changes made (possibly already has careerId)`
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