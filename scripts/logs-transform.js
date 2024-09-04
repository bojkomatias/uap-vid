import { MongoClient } from 'mongodb'
import 'dotenv/config'

// const Actions {
//     CREATE
//     EDIT
//     EDIT_BY_OWNER
//     PUBLISH
//     ASSIGN_TO_METHODOLOGIST
//     ASSIGN_TO_SCIENTIFIC
//     REVIEW
//     ACCEPT //This action is made by the secretary. Accept the protocol to be evalualuated by the VID committee
//     APPROVE //This approval is made by the admin and approve the protocol and mark it as ON_GOING
//     DISCONTINUE
//     FINISH
//     DELETE
//     GENERATE_ANUAL_BUDGET
//     VIEW_ANUAL_BUDGET
//   }

const uri = process.env.MONGO_URI
const client = new MongoClient(uri)

function getCollection(collection, db = process.env.DATABASE_NAME) {
  return client.db(db).collection(collection)
}

const ProtocolStatesDictionary = {
  DRAFT: 'Borrador',
  PUBLISHED: 'Publicado',
  METHODOLOGICAL_EVALUATION: 'Evaluación metodológica',
  SCIENTIFIC_EVALUATION: 'Evaluación científica',
  ACCEPTED: 'Aceptado',
  ON_GOING: 'En curso',
  FINISHED: 'Finalizado',
  DISCONTINUED: 'Discontinuado',
  DELETED: 'Eliminado',
}

//Small util function to get the key by its value. Useful to make some checks.
function getKeyByValue(object, value) {
  return Object.keys(object).find((key) => object[key] === value)
}

//Reads the "to" state from a message with the format ["prevState --> toState"] and pairs the protocol state with the action that was taken for the protocol to take said state.
const ActionFromStateDictionary = {
  Publicado: 'PUBLISH',
  'Evaluación metodológica': 'ASSIGN_TO_METHODOLOGIST',
  'Evaluación científica': 'ASSIGN_TO_SCIENTIFIC',
  'En evaluación metodológica': 'ASSIGN_TO_METHODOLOGIST',
  'Aceptado para evaluación en comisión': 'ACCEPT',
  Eliminado: 'DELETE',
  'En curso': 'APPROVE',
  Discontinuado: 'DISCONTINUE',
  Aceptado: 'ACCEPT',
}

export default async function main() {
  try {
    await client.connect().then(async () => {
      console.log('Connected successfully to MongoDB || LogsTransform')

      const logs_collection = getCollection('Logs')
      const logs = await logs_collection.find().toArray()

      for (const log of logs) {
        if (
          log.message &&
          getKeyByValue(
            ProtocolStatesDictionary,
            String(log.message).split('-->')[0].toString().trim()
          )
        ) {
          const updatedLog = await logs_collection.updateOne(
            { _id: log._id },
            {
              $set: {
                previousState: getKeyByValue(
                  ProtocolStatesDictionary,
                  String(log.message).split('-->')[0].toString().trim()
                ),
                action:
                  ActionFromStateDictionary[
                    String(log.message).split('-->')[1].toString().trim()
                  ],
              },
            }
          )

          console.log(
            `Updated log ${log._id}: ${updatedLog.modifiedCount} document modified, log has now previousState and action fields`
          )
        }
      }
    })
  } catch (error) {
    console.error('An error occurred while transforming logs:', error)
  } finally {
    await client.close()
    console.log('Connection closed || LogsTransform')
  }
}

await main()
