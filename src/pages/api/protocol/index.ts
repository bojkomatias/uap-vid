/* eslint-disable react-hooks/rules-of-hooks */
import type { NextApiRequest, NextApiResponse } from 'next'
import getCollection, { CollectionName } from '../../../utils/bd/getCollection'
import { getAllProtocols, createProtocol } from '../../../repositories/protocol'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    if (req.method === 'POST') {
        const created = await createProtocol({
            createdAt: new Date(),
            ...req.body,
        })
        if (!created) return res.status(500).end()
        return res.status(200).json(created)
    }
    if (req.method === 'GET') {
        const data = await getAllProtocols()

        if (!data) {
            return res.status(404).end()
        }
        return res.status(200).json(data)
    }
}
