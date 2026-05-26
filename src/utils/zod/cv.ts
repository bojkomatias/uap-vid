import { z } from 'zod'

export const CV_MAX_BYTES = 10 * 1024 * 1024 // 10 MB
export const CV_MIME = 'application/pdf'

export const CvMetadataSchema = z.object({
  cvFileKey: z.string().nullable(),
  cvFileName: z.string().nullable(),
  cvFileSize: z.number().int().positive().nullable(),
  cvUploadedAt: z.date().nullable(),
})

export type CvMetadata = z.infer<typeof CvMetadataSchema>
