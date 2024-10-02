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
      console.log('Connected successfully to MongoDB || IndexesInsert')

      const indexes_collection = getCollection('Index')
      const chat_messages_collection = getCollection('ChatMessage')

      await indexes_collection.deleteMany({})
      /*
      Aprovecho este script para borrar los mensajes de chat para no tener que hacer otro archivo
      Borro los mensajes porque la mayoría de las veces mandamos mensajes con los usuarios de prueba y al eliminarse (con el dump y restore de la BBDD) se pierde el ID, lo que provoca que la query de Prisma se rompa.
      */
      await chat_messages_collection.deleteMany({})

      const now = new Date() // Current date and time

      const FCA = await indexes_collection.insertOne({
        unit: 'FCA',
        values: [{ from: now, to: null, price: 4500 }],
      })

      const FMR = await indexes_collection.insertOne({
        unit: 'FMR',
        values: [{ from: now, to: null, price: 3000 }],
      })

      console.log('Inserted FCA index', FCA.insertedId)
      console.log('Inserted FMR index', FMR.insertedId)
    })
  } catch (error) {
    console.error('An error occurred while inserting indexes:', error)
  } finally {
    await client.close()
    console.log('Connection closed || IndexesInsert')
  }
}
