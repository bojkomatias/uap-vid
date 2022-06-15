import type { NextApiRequest, NextApiResponse } from 'next'
import getCollection, { CollectionName } from '../../../utils/bd/getCollection'
import { getSession } from 'next-auth/react'
import { ObjectId } from 'mongodb';
export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) { 
    if (req.method === 'PUT') {
        
        const users = await getCollection(CollectionName.Users)
        const { id } = req.query

        const {role} = req.body

        if (!id || !role) {
            return res.status(400).end({message:"Invalid data"})
        }

        const updated = await users.updateOne({_id: new ObjectId(id as string)}, 
            { $set: { 'role': role } })

        if (updated) {
            return res.status(200).json({message: "success"})
        }
        
        return res.status(400).end({message:"Invalid data"})
    }
}