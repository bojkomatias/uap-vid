import { z } from 'zod'

/////////////////////////////////////////
// EMAIL TEMPLATE SCHEMA
/////////////////////////////////////////

export const EmailContentTemplateSchema = z.object({
  content: z.string().min(1, { message: 'El campo no puede estar vacío' }),
  subject: z.string().min(1, { message: 'El campo no puede estar vacío' }),
  useCase: z.string(),
  id: z.string().nullable(),
})
