import mongodb from 'mongodb'
import 'dotenv/config'

const MongoClient = mongodb.MongoClient
const uri = process.env.MONGO_URI
//const client = new MongoClient(uri)

console.log(uri)

/**This script adds the academicUnitIds array in the Protocol object. This field is necessary for Prisma to create a virtual relation between Protocol and AcademicUnit.
 -Needs a little refactoring.
 */
async function main() {
  try {
    // await client.connect()
    // console.log('Connected successfully to server')
    // const acCollection = client.db('develop').collection('AcademicUnit')
    // const academic_units = await acCollection.find().toArray()
    // const acs_dictionary = academic_units.reduce((acc, ac) => {
    //   acc[ac.shortname] = ac._id
    //   return acc
    // }, {})
    // console.log(academic_units)
  } catch (error) {
    console.error('An error occurred:', error)
  } finally {
    //await client.close()
    console.log('Connection closed')
  }
}

main()
