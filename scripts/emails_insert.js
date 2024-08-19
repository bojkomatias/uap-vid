import { MongoClient } from 'mongodb'
import 'dotenv/config'

const uri = process.env.MONGO_URI
const client = new MongoClient(uri)

function getCollection(collection, db = 'main') {
  return client.db(db).collection(collection)
}

const emails = [
  {
    useCase: 'onReview',
    subject: 'Proyecto evaluado',
    content: 'Tu protocolo fue revisado por un evaluador.',
  },
  {
    useCase: 'onRevised',
    subject: 'Correcciones revisadas ',
    content:
      'Las correcciones al protocolo fueron revisadas y el protocolo fue modificado acorde a las mismas.',
  },

  {
    useCase: 'onAssignation',
    subject: 'Nuevo proyecto asignado',
    content: 'Se te asignó un nuevo protocolo para evaluar.',
  },
  {
    useCase: 'onPublish',
    subject: 'Nuevo protocolo publicado',
    content:
      'Un nuevo protocolo fue publicado en la unidad académica que te corresponde.',
  },
  {
    useCase: 'onApprove',
    subject: 'Proyecto aprobado',
    content:
      'Se aprobó tu proyecto de investigación y el presupuesto del mismo.',
  },
  {
    useCase: 'changeUserEmail',
    subject: 'Acá va tu código de confirmación toga',
    content: 'Este es el código de confirmación para cambiar tu email',
  },
]

export default async function main() {
  try {
    await client.connect().then(async () => {
      console.log('Connected successfully to server || EmailsInsert')

      const emails_collection = getCollection('EmailContentTemplate')

      await emails_collection.deleteMany({})

      for (const email of emails) {
        try {
          const email_insert = await emails_collection.insertOne({ ...email })
          console.log('Inserted email', email_insert)
        } catch (e) {
          console.log('Error occured while inserting email', e)
        }
      }
    })
  } catch (error) {
    console.error('An error occurred while inserting emails:', error)
  } finally {
    await client.close()
    console.log('Connection closed || EmailsInsert')
  }
}

main().catch(console.error)
