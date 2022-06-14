/* eslint-disable react-hooks/rules-of-hooks */
import type { NextApiRequest, NextApiResponse } from 'next'
import getCollection, { CollectionName } from '../../../utils/bd/getCollection'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    if (req.method === 'POST') {
        const collection = await getCollection(CollectionName.Protocols)
        const data = await collection.insertOne({createdAt:Date.now() ,...req.body})
        console.log(data)

        return res.status(200).json(data)
    }
    if (req.method === 'GET') {
        const collection = await getCollection(CollectionName.Protocols)
        const data = await collection.find({}).toArray()
        console.log(data)
        if (!data) {
            res.status(404).end()
            return
        }
        res.status(200).json(data)
    }
}
