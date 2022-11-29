import type { NextApiRequest, NextApiResponse } from 'next'
import {updateUserById} from '../../../repositories/users'
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) { 
    if (req.method === 'PUT') {
        const { id } = req.query
        const {role} = req.body

        if (!id || !role) {
            return res.status(400).end({message:"Invalid data"})
        }

        const updated = await updateUserById(id as string, {role})

        if (updated) {
            return res.status(200).json({message: "success"})
        }
        
        return res.status(400).end({message:"Invalid data"})
    }
}