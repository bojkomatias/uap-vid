import { MongoClient, ObjectId } from 'mongodb'
import 'dotenv/config'
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

//This is because we've been saving state changes messages with two different formats.
const ProtocolStatesDictionary2 = {
  METHODOLOGICAL_EVALUATION: 'En evaluación metodológica',
  SCIENTIFIC_EVALUATION: 'En evaluación científica',
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
  'En evaluación científica': 'ASSIGN_TO_SCIENTIFIC',
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

      const reviews_collection = getCollection('Review')
      const reviews = await reviews_collection.find().toArray()

      for (const log of logs) {
        const protocolReviews = reviews.filter(
          (r) => r.protocolId.toString() == log.protocolId.toString()
        )

        //Checks to only modify logs that have a message and that such message is not a custom message but it has keywords corresponding to state changes.
        if (
          log.message &&
          (getKeyByValue(
            ProtocolStatesDictionary,
            String(log.message).split('-->')[0].toString().trim()
          ) ||
            getKeyByValue(
              ProtocolStatesDictionary2,
              String(log.message).split('-->')[0].toString().trim()
            ))
        ) {
          const actionTaken =
            ActionFromStateDictionary[
              String(log.message).split('-->')[1].toString().trim()
            ]

          const updatedLog = await logs_collection.updateOne(
            { _id: log._id },
            {
              $set: {
                previousState: getKeyByValue(
                  ProtocolStatesDictionary,
                  String(log.message).split('-->')[0].toString().trim()
                ),
                action: actionTaken,
                reviewerId:
                  actionTaken == 'ASSIGN_TO_METHODOLOGIST' ?
                    protocolReviews.find((p) => p.type == 'METHODOLOGICAL')
                      ?.reviewerId
                  : (
                    actionTaken == 'ASSIGN_TO_SCIENTIFIC' &&
                    protocolReviews.find((p) => p.type == 'SCIENTIFIC_INTERNAL')
                  ) ?
                    protocolReviews.find((p) => p.type == 'SCIENTIFIC_INTERNAL')
                      ?.reviewerId
                  : null,
              },
            }
          )

          console.log(
            `Updated log ${log._id}: ${updatedLog.modifiedCount} document modified, log has now previousState and action fields`
          )
        }
      }

      const logs_scientific_evaluations = await logs_collection
        .find({
          action: 'ASSIGN_TO_SCIENTIFIC',
        })
        .toArray()

      //Group logs by protocolId. I already filtered the logs that are related to scientific evaluations, now I  group them by protocolId
      const logsGroupedById = logs_scientific_evaluations.reduce((acc, log) => {
        if (!acc[log.protocolId]) {
          acc[log.protocolId] = []
        }
        acc[log.protocolId].push(log)
        return acc
      }, {})

      const result = Object.entries(logsGroupedById).filter(
        (r) => r[1].length > 1
      )

      //This is looping through logs, not evaluations, but to differeantiate this loop from the previous one, I'm calling the variable "evaluations"
      for (const evaluations of result) {
        const evaluation1 = evaluations[1][0]
        const evaluation2 = evaluations[1][1]
        const protocolId = evaluations[0]
        const evaluation1Date = new Date(evaluation1.createdAt)
        const evaluation2Date = new Date(evaluation2.createdAt)

        const protocolExternalReview = reviews.find(
          (r) =>
            r.protocolId.toString() == protocolId.toString() &&
            r.type == 'SCIENTIFIC_EXTERNAL'
        )

        if (evaluation1Date < evaluation2Date) {
          const updatedLog = await logs_collection.updateOne(
            { _id: evaluation2._id },
            {
              $set: {
                reviewerId: protocolExternalReview?.reviewerId,
              },
            }
          )

          console.log(
            `Updated log ${evaluation2._id}: ${updatedLog.modifiedCount} document modified, now logs corresponding to external reviews are fixed`
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
