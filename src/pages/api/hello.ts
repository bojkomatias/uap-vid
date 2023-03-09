// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import getCollection, { CollectionName } from '../../utils/bd/getCollection'
import clientPromise from '../../utils/mongodb'

type Data = {
    name: string
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    // const client = await clientPromise
    // const db = client.db('research')
    // const collection = db.collection('hello')
    // await collection.insertOne({ name: 'world' })
    // const data = await collection.findOne({ name: 'world' })
    const collection = await getCollection(CollectionName.Test)
    //get all data
    const data = await collection.find({}).toArray()
    // const data = await collection.find({})
    if (!data) {
        res.status(404)
        res.end()
        return
    }
    res.status(200).json({ success: true, data })
}
