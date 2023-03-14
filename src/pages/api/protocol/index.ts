/* eslint-disable react-hooks/rules-of-hooks */
import type { NextApiRequest, NextApiResponse } from 'next'
import getCollection, { CollectionName } from '../../../utils/bd/getCollection'
import { getAllProtocols } from '../../../repositories/protocol'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    if (req.method === 'POST') {
        const collection = await getCollection(CollectionName.Protocols)
        const data = await collection.insertOne({
            createdAt: new Date(),
            ...req.body,
        })
        return res.status(200).json(data)
    }
    if (req.method === 'GET') {
        const data = await getAllProtocols()

        if (!data) {
            return res.status(404).end()
        }
        return res.status(200).json(data)
    }
}
