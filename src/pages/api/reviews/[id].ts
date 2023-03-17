/* eslint-disable react-hooks/rules-of-hooks */
import type { NextApiRequest, NextApiResponse } from 'next'
import getCollection, { CollectionName } from '../../../utils/bd/getCollection'
import { createComment } from '../../../repositories/reviews'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const protocolId = req.query.id
    if (req.method === 'PUT') {
        const insertedComment = await createComment(
            req.body,
            protocolId as string
        )
        if (!insertedComment) return res.status(500).end()
        return res.status(200).json(insertedComment)
    }
}
