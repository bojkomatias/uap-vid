import { NextApiRequest, NextApiResponse } from 'next/types'
import {findProtocolById, updateProtocolById} from '../../../repositories/protocol'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const { id } = req.query
    if (req.method === 'GET') {
        const data = await findProtocolById(id as string)

        if (!data) {
            res.status(404).end()
            return
        }
        return res.status(200).json(data)
    }

    if (req.method === 'PUT') {
        const protocol = req.body
        delete protocol.id
        const updated = await updateProtocolById(id as string, protocol)
        
        if (!updated) {
            return res.status(404).end()
        }
        return res.status(200).json({ sucess: true })
    }
}
