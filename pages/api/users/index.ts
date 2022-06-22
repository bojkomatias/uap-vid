/* eslint-disable react-hooks/rules-of-hooks */
import type { NextApiRequest, NextApiResponse } from 'next'
import getCollection, { CollectionName } from '../../../utils/bd/getCollection'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    if (req.method === 'GET') {
        const collection = await getCollection(CollectionName.Users)
        const data = await collection.find({}).toArray()

        if (!data) {
            res.status(404).end()
            return
        }

        return res.status(200).json(data)
    }
}
