import { MongoClient } from 'mongodb'
import 'dotenv/config'

const uri = process.env.MONGO_URI
const client = new MongoClient(uri)

function getCollection(collection, db = process.env.DATABASE_NAME) {
  return client.db(db).collection(collection)
}

const ProtocolStatesDictionary = {
  "DRAFT": 'Borrador',
  "PUBLISHED": 'Publicado',
  "METHODOLOGICAL_EVALUATION": 'Evaluación metodológica',
  "SCIENTIFIC_EVALUATION": 'Evaluación científica',
  "ACCEPTED": 'Aceptado',
  "ON_GOING": 'En curso',
  "FINISHED": 'Finalizado',
  "DISCONTINUED": 'Discontinuado',
  "DELETED": 'Eliminado',
}

export default async function main() {
  try {
    await client.connect().then(async () => {
      console.log('Connected successfully to MongoDB || LogsTransform')

      const logs_collection = getCollection('Logs')

      const logs = await logs_collection.find().toArray()

      console.log(ProtocolStatesDictionary['ACCEPTED'])
    })
  } catch (error) {
    console.error('An error occurred while transforming logs:', error)
  } finally {
    await client.close()
    console.log('Connection closed || LogsTransform')
  }
}

await main()
