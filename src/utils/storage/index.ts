import fs from 'fs/promises'
import path from 'path'

const getRoot = () => {
  const dir = process.env.UPLOAD_DIR || './uploads'
  return path.isAbsolute(dir) ? dir : path.resolve(process.cwd(), dir)
}

const resolveSafe = (key: string) => {
  const root = getRoot()
  const normalized = path
    .normalize(key)
    .replace(/^([/\\])+/, '')
    .replace(/\\/g, '/')
  if (normalized.split('/').some((segment) => segment === '..')) {
    throw new Error(`Invalid storage key: ${key}`)
  }
  const full = path.resolve(root, normalized)
  const rootResolved = path.resolve(root)
  if (full !== rootResolved && !full.startsWith(rootResolved + path.sep)) {
    throw new Error(`Storage key escapes root: ${key}`)
  }
  return full
}

export const putFile = async (key: string, body: Buffer | Uint8Array) => {
  const full = resolveSafe(key)
  await fs.mkdir(path.dirname(full), { recursive: true })
  await fs.writeFile(full, body)
}

export const getFile = async (key: string): Promise<Buffer | null> => {
  try {
    return await fs.readFile(resolveSafe(key))
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null
    throw error
  }
}

export const deleteFile = async (key: string) => {
  try {
    await fs.unlink(resolveSafe(key))
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error
  }
}

export const statFile = async (key: string) => {
  try {
    const stat = await fs.stat(resolveSafe(key))
    return { size: stat.size, mtime: stat.mtime }
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null
    throw error
  }
}
