import { NextApiRequest, NextApiResponse } from 'next/types'
import getCollection, { CollectionName } from '../../../utils/bd/getCollection'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { id } = req.query
    if (req.method === 'GET') {
        const collection = await getCollection(CollectionName.Protocols)
        const data = await collection.find({ _id: id }).toArray()
        if (!data) {
            res.status(404).end()
            return
        }
        res.status(200).json(data)
    }

    if (req.method === 'POST' || req.method === 'PUT') {
        const { protocol } = req.body
        const collection = await getCollection(CollectionName.Protocols)
        const updated = await collection.updateOne(
            { _id: id },
            { $set: protocol },
            { upsert: true }
        )
        if (updated.modifiedCount === 0) {
            res.status(404).end()
            return
        }
        res.status(200).json({ sucess: true })
    }
}
