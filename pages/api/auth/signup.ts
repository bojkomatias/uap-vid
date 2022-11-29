import { hash } from 'bcryptjs'
import { NextApiRequest, NextApiResponse } from 'next'
import {findUserByEmail, saveUser} from '../../../utils/bd/users'

async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { name, email, password, role } = req.body
        //Validate
        if (!email || !email.includes('@') || !password) {
            res.status(422).json({ message: 'Invalid Data' })
            return
        }
        //Check if user exists
        const checkExisting = await findUserByEmail(email)

        if (checkExisting) {
            return res.status(422).json({ message: 'User already exists' })
        }

        //Hash password
        const status = await saveUser({
            name,
            email,
            password: await hash(password, 12),
            role,
        })
        res.status(201).json({ message: 'User created', ...status })
    } else {
        res.status(500).json({ message: 'Route not valid' })
    }
}

export default handler
