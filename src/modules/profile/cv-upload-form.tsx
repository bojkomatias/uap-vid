'use client'

import { Button } from '@components/button'
import { FieldGroup, Fieldset, Legend } from '@components/fieldset'
import { Text } from '@components/text'
import { notifications } from '@elements/notifications'
import { dateFormatter } from '@utils/formatters'
import { CV_MAX_BYTES, CV_MIME } from '@utils/zod/cv'
import { useRouter } from 'next/navigation'
import { useRef, useState, useTransition } from 'react'
import { Download, Trash, Upload } from 'tabler-icons-react'

const formatBytes = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`
}

type Props = {
  userId: string
  initial: {
    cvFileName: string | null
    cvFileSize: number | null
    cvUploadedAt: Date | null
  }
}

export function CvUploadForm({ userId, initial }: Props) {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [isPending, startTransition] = useTransition()
  const [isUploading, setIsUploading] = useState(false)
  const hasCv = Boolean(initial.cvFileName)

  const upload = async (file: File) => {
    if (file.type !== CV_MIME) {
      notifications.show({
        title: 'Formato inválido',
        message: 'El archivo debe ser PDF',
        intent: 'error',
      })
      return
    }
    if (file.size > CV_MAX_BYTES) {
      notifications.show({
        title: 'Archivo demasiado grande',
        message: `El CV no puede superar ${formatBytes(CV_MAX_BYTES)}`,
        intent: 'error',
      })
      return
    }

    setIsUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      const res = await fetch(`/api/files/cv/${userId}`, {
        method: 'POST',
        body: form,
      })
      if (!res.ok) {
        const data = await res.json().catch(() => null)
        notifications.show({
          title: 'Error al subir',
          message: data?.error || 'No se pudo subir el CV',
          intent: 'error',
        })
        return
      }
      notifications.show({
        title: 'CV cargado',
        message: 'Tu CV se actualizó con éxito',
        intent: 'success',
      })
      startTransition(() => router.refresh())
    } finally {
      setIsUploading(false)
      if (inputRef.current) inputRef.current.value = ''
    }
  }

  const remove = async () => {
    if (!confirm('¿Eliminar tu CV?')) return
    const res = await fetch(`/api/files/cv/${userId}`, { method: 'DELETE' })
    if (!res.ok) {
      notifications.show({
        title: 'Error',
        message: 'No se pudo eliminar el CV',
        intent: 'error',
      })
      return
    }
    notifications.show({
      title: 'CV eliminado',
      message: 'Tu CV fue eliminado',
      intent: 'success',
    })
    startTransition(() => router.refresh())
  }

  return (
    <Fieldset>
      <Legend>CV</Legend>
      <Text className="!text-xs">
        Cargá un CV en formato PDF resumiendo tu experiencia relevante para la
        actividad investigadora. Tamaño máximo {formatBytes(CV_MAX_BYTES)}.
        Visible para usuarios del sistema.
      </Text>
      <FieldGroup>
        {hasCv && (
          <div className="flex flex-wrap items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-800">
            <div className="flex-1">
              <Text className="!text-sm font-medium">
                {initial.cvFileName}
              </Text>
              <Text className="!text-xs">
                {initial.cvFileSize ? formatBytes(initial.cvFileSize) : '—'}
                {initial.cvUploadedAt && (
                  <>
                    {' · '}cargado el {dateFormatter.format(initial.cvUploadedAt)}
                  </>
                )}
              </Text>
            </div>
            <Button href={`/api/files/cv/${userId}`} color="light">
              <Download data-slot="icon" />
              Descargar
            </Button>
            <Button onClick={remove} color="light" disabled={isPending}>
              <Trash data-slot="icon" />
              Eliminar
            </Button>
          </div>
        )}

        <input
          ref={inputRef}
          type="file"
          accept="application/pdf"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) void upload(file)
          }}
        />
        <div>
          <Button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={isUploading || isPending}
          >
            <Upload data-slot="icon" />
            {isUploading ?
              'Subiendo…'
            : hasCv ?
              'Reemplazar CV'
            : 'Subir CV'}
          </Button>
        </div>
      </FieldGroup>
    </Fieldset>
  )
}
