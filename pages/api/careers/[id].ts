import type { NextApiRequest, NextApiResponse } from 'next'
import getCollection, { CollectionName } from '../../../utils/bd/getCollection'
import { getSession } from 'next-auth/react'
import { ObjectId } from 'mongodb'
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    if (req.method === 'GET') {
        const { career } = req.query
        return res.status(404).end({ message: 'Invalid data' })
    }
}
