import { ObjectId } from 'mongodb'
import { NextApiRequest, NextApiResponse } from 'next/types'
import { Protocol } from '../../../config/createContext'
import getCollection, { CollectionName } from '../../../utils/bd/getCollection'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { id } = req.query
    if (req.method === 'GET') {
        const collection = await getCollection(CollectionName.Protocols)
        const data = await collection.findOne({
            _id: new ObjectId(id as string),
        })

        if (!data) {
            res.status(404).end()
            return
        }
        return res.status(200).json(data)
    }

    if (req.method === 'PUT') {
        const protocol = req.body
        const collection = await getCollection(CollectionName.Protocols)
        const filter = { _id: new ObjectId(id as string) }
        delete protocol._id
        const updated = await collection.updateOne(
            filter,
            { $set: protocol },
            { upsert: true }
        )
        if (updated.modifiedCount === 0) {
            res.status(404).end()
            return
        }
        return res.status(200).json({ sucess: true })
    }
}
