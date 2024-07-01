import mongodb from 'mongodb'
import { ObjectId } from 'mongodb'

const MongoClient = mongodb.MongoClient
const uri =
    'mongodb+srv://admin:d8oZb8WbVYtiKUY5@research.kcnnb.mongodb.net/?retryWrites=true&w=majority'
const client = new MongoClient(uri)

/**This script adds the academicUnitIds array in the Protocol object. This field is necessary for Prisma to create a virtual relation between Protocol and AcademicUnit.
 -Needs a little refactoring.
 */
async function main() {
    try {
        await client.connect()
        console.log('Connected successfully to server')

        const acCollection = client.db('develop').collection('AcademicUnit')
        const academic_units = await acCollection.find().toArray()
        const acs_dictionary = academic_units.reduce((acc, ac) => {
            acc[ac.shortname] = ac._id
            return acc
        }, {})

        const protocolCollection = client.db('develop').collection('Protocol')
        const protocols = await protocolCollection.find().toArray()

        const protocolsForMongo = protocols.map((p) => {
            return {
                ...p,
                sections: {
                    ...p.sections,
                    identification: {
                        ...p.sections.identification,
                        academicUnitIds: p.sections.identification.sponsor
                            .map((s) => {
                                const shortname = s.split('-')[1]?.trim()
                                return acs_dictionary[shortname]
                                    ? acs_dictionary[shortname]
                                    : null
                            })
                            .filter((id) => id !== null),
                    },
                },
            }
        })

        console.log('Prepared protocols for update:', protocolsForMongo.length)

        for (const p of protocolsForMongo) {
            try {
                const result = await protocolCollection.updateOne(
                    { _id: new ObjectId(p._id) },
                    {
                        $set: {
                            'sections.identification.academicUnitIds':
                                p.sections.identification.academicUnitIds,
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

        console.log('Academic Units Dictionary:', acs_dictionary)
    } catch (error) {
        console.error('An error occurred:', error)
    } finally {
        await client.close()
        console.log('Connection closed')
    }
}

main()
