import { hash, genSalt, compare } from 'bcryptjs'
import { scrypt, randomBytes } from 'crypto'

export async function createHashBcrypt(password: string) {
  const salt = await genSalt(14)
  const hashedPassword = await hash(password, salt)
  return hashedPassword
}

export async function createHashScrypt(password: string) {
  const salt = randomBytes(8).toString('hex')
  const hash = (await new Promise((resolve, reject) => {
    scrypt(
      Buffer.from(password, 'utf8'),
      Buffer.from(salt, 'utf8'),
      64,
      { N: 1024 },
      (err, derivedKey) => {
        if (err) reject(err)
        resolve(`${salt}|${derivedKey.toString('hex')}`)
      }
    )
  })) as string
  return hash
}

export async function verifyHashScrypt(password: string, hash: string) {
  const [salt, key] = hash.split('|')
  const isValid = (await new Promise((resolve, reject) => {
    scrypt(
      Buffer.from(password, 'utf8'),
      Buffer.from(salt, 'utf8'),
      64,
      { N: 1024 },
      (err, derivedKey) => {
        if (err) reject(err)
        resolve(key === derivedKey.toString('hex'))
      }
    )
  })) as boolean
  return isValid
}

export async function verifyHashBcrypt(password: string, hashStored: string) {
  return await compare(password, hashStored)
}
