import { getServerSession } from 'next-auth'
import { authOptions } from 'app/api/auth/[...nextauth]/auth'
import { NextResponse } from 'next/server'
import { randomUUID } from 'crypto'
import { prisma } from '@utils/bd'
import { getFile, putFile, deleteFile } from '@utils/storage'
import { CV_MAX_BYTES, CV_MIME } from '@utils/zod/cv'

const PDF_MAGIC = Buffer.from('%PDF')

export const GET = async (
  _req: Request,
  { params }: { params: Promise<{ userId: string }> }
) => {
  const session = await getServerSession(authOptions)
  if (!session) return new NextResponse('Unauthorized', { status: 401 })

  const { userId } = await params
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { cvFileKey: true, cvFileName: true },
  })

  if (!user?.cvFileKey) return new NextResponse('Not Found', { status: 404 })

  const data = await getFile(user.cvFileKey)
  if (!data) return new NextResponse('Not Found', { status: 404 })

  const filename = user.cvFileName || 'cv.pdf'
  return new NextResponse(new Uint8Array(data), {
    status: 200,
    headers: {
      'Content-Type': CV_MIME,
      'Content-Length': String(data.length),
      'Content-Disposition': `inline; filename="${encodeURIComponent(filename)}"`,
      'Cache-Control': 'private, max-age=0, must-revalidate',
    },
  })
}

export const POST = async (
  req: Request,
  { params }: { params: Promise<{ userId: string }> }
) => {
  const session = await getServerSession(authOptions)
  if (!session) return new NextResponse('Unauthorized', { status: 401 })

  const { userId } = await params
  const isSelf = session.user.id === userId
  const isAdmin = session.user.role === 'ADMIN'
  if (!isSelf && !isAdmin) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  const contentLength = Number(req.headers.get('content-length') || 0)
  if (contentLength > CV_MAX_BYTES * 1.1) {
    return NextResponse.json(
      { error: 'El archivo supera el tamaño máximo de 10 MB' },
      { status: 413 }
    )
  }

  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }

  const file = formData.get('file')
  if (!(file instanceof File)) {
    return NextResponse.json(
      { error: 'Falta el archivo (campo "file")' },
      { status: 400 }
    )
  }

  if (file.type && file.type !== CV_MIME) {
    return NextResponse.json(
      { error: 'El archivo debe ser PDF' },
      { status: 415 }
    )
  }

  if (file.size > CV_MAX_BYTES) {
    return NextResponse.json(
      { error: 'El archivo supera el tamaño máximo de 10 MB' },
      { status: 413 }
    )
  }

  const buffer = Buffer.from(await file.arrayBuffer())
  if (!buffer.subarray(0, 4).equals(PDF_MAGIC)) {
    return NextResponse.json(
      { error: 'El archivo no es un PDF válido' },
      { status: 415 }
    )
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { cvFileKey: true },
  })
  if (!user) return new NextResponse('Not Found', { status: 404 })

  const newKey = `cv/${userId}/${randomUUID()}.pdf`
  await putFile(newKey, buffer)

  const original =
    (file.name || 'cv.pdf').endsWith('.pdf') ?
      file.name || 'cv.pdf'
      : `${file.name || 'cv'}.pdf`

  await prisma.user.update({
    where: { id: userId },
    data: {
      cvFileKey: newKey,
      cvFileName: original,
      cvFileSize: buffer.length,
      cvUploadedAt: new Date(),
    },
  })

  if (user.cvFileKey && user.cvFileKey !== newKey) {
    await deleteFile(user.cvFileKey)
  }

  return NextResponse.json({
    ok: true,
    cvFileName: original,
    cvFileSize: buffer.length,
  })
}

export const DELETE = async (
  _req: Request,
  { params }: { params: Promise<{ userId: string }> }
) => {
  const session = await getServerSession(authOptions)
  if (!session) return new NextResponse('Unauthorized', { status: 401 })

  const { userId } = await params
  const isSelf = session.user.id === userId
  const isAdmin = session.user.role === 'ADMIN'
  if (!isSelf && !isAdmin) {
    return new NextResponse('Forbidden', { status: 403 })
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { cvFileKey: true },
  })
  if (user?.cvFileKey) {
    await deleteFile(user.cvFileKey)
  }
  await prisma.user.update({
    where: { id: userId },
    data: {
      cvFileKey: null,
      cvFileName: null,
      cvFileSize: null,
      cvUploadedAt: null,
    },
  })

  return NextResponse.json({ ok: true })
}
