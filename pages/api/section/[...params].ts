import { ObjectId } from 'mongodb'
import { NextApiRequest, NextApiResponse } from 'next/types'
import { Protocol, Section } from '../../../config/createContext'
import getCollection, { CollectionName } from '../../../utils/bd/getCollection'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { params } = req.query
    const [protocolId, sectionNumber] = params as string[]

    const sectionId = parseInt(sectionNumber)

    const protocol = await getProtocolIfValid(protocolId)

    //Protocol not exist
    if (!protocol) {
        return res.status(404).json({
            protocolId,
            sectionNumber,
            message: `There is no protocol with id: ${protocolId}`,
        })
    }

    // //Section number is to high or too low
    // const protocolHasntSection = !protocol.data.some(
    //     (x) => x.sectionId === sectionId
    // )
    // if (protocolHasntSection || sectionId <= 0) {
    //     return res.status(404).json({
    //         protocolId,
    //         sectionId,
    //         message: `We found the protocol: ${protocolId}, but just have ${protocol.data.length} sections.`,
    //         protocol,
    //     })
    // }

    // try {
    //     if (req.method === 'GET') {
    //         res.status(200).json({
    //             protocolLength: protocol.data.length,
    //             section: protocol?.data.find((x) => x.sectionId === sectionId),
    //         })
    //     }

    //     if (req.method === 'PUT') {
    //         const section = req.body

    //         const updated = await updateSection(protocolId, sectionId, section)

    //         if (updated.modifiedCount === 0) {
    //             res.status(404).end()
    //             return
    //         }
    //         return res.status(200).json({ sucess: true })
    //     }
    // } catch (e) {
    //     const error = e as Error
    //     return res.status(500).json(e)
    // }
}

const updateSection = async (
    protocolId: string,
    sectionId: number,
    section: Section
) => {
    const collection = await getCollection(CollectionName.Protocols)

    const filter = {
        _id: new ObjectId(protocolId as string),
        'data.sectionId': sectionId,
    }

    const result = await collection.updateOne(
        filter,
        { $set: { 'data.$': section, updatedAt: Date.now() } },
        {
            upsert: true,
        }
    )

    return result
}

const getProtocolIfValid = async (protocolId: string) => {
    const collection = await getCollection(CollectionName.Protocols)
    const protocol = await collection.findOne<Protocol>({
        _id: new ObjectId(protocolId as string),
    })

    return protocol
}
