import mongodb from 'mongodb'
import { ObjectId } from 'mongodb'
import 'dotenv/config'
const uri = process.env.MONGO_URI

const MongoClient = mongodb.MongoClient
const client = new MongoClient(uri)

/**This script adds the academicUnitIds array in the Protocol object. This field is necessary for Prisma to create a virtual relation between Protocol and AcademicUnit.
 -Needs a little refactoring.
 */

function getCollection(collection, db = process.env.DATABASE_NAME) {
  return client.db(db).collection(collection)
}

export default async function main() {
  try {
    await client.connect().then(async () => {
      console.log(
        'Connected successfully to server || AcademicUnitProtocolRelation'
      )

      const academic_unit_collection = getCollection('AcademicUnit')
      const academic_units = await academic_unit_collection.find().toArray()
      const acs_dictionary = academic_units.reduce((acc, ac) => {
        acc[ac.shortname] = ac._id
        return acc
      }, {})

      console.log('Academic Units Dictionary:', acs_dictionary)
      const protocolCollection = client
        .db(process.env.DATABASE_NAME)
        .collection('Protocol')
      const protocols = await protocolCollection.find().toArray()

      const protocolsForMongo = protocols.map((p) => ({
        protocol_id: p._id,
        academicUnitIds: p.sections.identification.sponsor
          .map((s) => {
            const shortname = s.split('-')[1]?.trim()
            return acs_dictionary[shortname] ? acs_dictionary[shortname] : null
          })
          .filter((id) => id !== null),
      }))

      console.log('Prepared protocols for update:', protocolsForMongo.length)

      for (const p of protocolsForMongo) {
        try {
          const result = await protocolCollection.updateOne(
            { _id: new ObjectId(p.protocol_id) },
            {
              $set: {
                'sections.identification.academicUnitIds': p.academicUnitIds,
              },
            }
          )
          console.log(
            `Updated protocol ${p._id}: ${result.modifiedCount} document modified`
          )
        } catch (error) {
          console.error(`Error updating protocol ${p._id}:`, error)
        }
      }
    })
  } catch (error) {
    console.error('An error occurred while updating protocols:', error)
  } finally {
    await client.close()
    console.log('Connection closed || AcademicUnitProtocolRelation')
  }
}

main()
