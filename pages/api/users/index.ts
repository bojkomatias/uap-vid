/* eslint-disable react-hooks/rules-of-hooks */
import type { NextApiRequest, NextApiResponse } from 'next'
import {getAllUsers} from '../../../repositories/users'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    if (req.method === 'GET') {
        const data = await getAllUsers()
        
        if (!data) {
            res.status(404).end()
            return
        }

        return res.status(200).json(data)
    }
}
