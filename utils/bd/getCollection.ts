import clientPromise from '../mongodb'

export enum CollectionName {
    Protocols = 'protocol',
    Users = 'user',
    Test = 'hello',
}

export default async function getCollection(collectionName: CollectionName) {
    const client = await clientPromise
    const db = client.db(process.env.MONGODB_NAME)
    const collection = db.collection(collectionName)
    return collection
}
