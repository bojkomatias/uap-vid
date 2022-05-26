import { NextApiRequest, NextApiResponse } from "next/types"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const {id} = req.query
    const collection = await useDb(CollectionName.Protocols)
    const data = await collection.find({_id:id}).toArray()
    if (!data) {
        res.status(404).end()
        return
    }
    res.status(200).json(data)
}