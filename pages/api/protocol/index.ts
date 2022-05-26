/* eslint-disable react-hooks/rules-of-hooks */
import type { NextApiRequest, NextApiResponse } from 'next'
import useDb, { CollectionName } from '../../../utils/useDB'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const collection = await useDb(CollectionName.Protocols)
    const data = await collection.find({}).toArray()
    if (!data) {
        res.status(404).end()
        return
    }
    res.status(200).json(data)
}
