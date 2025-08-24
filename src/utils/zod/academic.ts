import { z } from 'zod'

/////////////////////////////////////////
// ACADEMIC UNIT SCHEMA
/////////////////////////////////////////

export const AcademicUnitSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: 'El nombre no puede quedar vacío' }),
  shortname: z.string().min(1, { message: '' }),
  // secretariesIds: z.string().array(),
  // academicUnitAnualBudgetsIds: z.string().array(),
})

/////////////////////////////////////////
// CAREER SCHEMA
/////////////////////////////////////////

export const CareerSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(10, {
    message: 'Debe tener al menos 10 caracteres',
  }),
  active: z.boolean(),
  courses: z
    .string()
    .transform((value) => value.split(',').map(String))
    .pipe(z.string().array()),
})

export type Career = z.infer<typeof CareerSchema>

/////////////////////////////////////////
// CONVOCATORY SCHEMA
/////////////////////////////////////////

export const ConvocatorySchema = z
  .object({
    id: z.string().optional(),
    createdAt: z.coerce.date().optional(),
    name: z.string().min(6, {
      message: 'Debe tener mínimo 6 caracteres',
    }),
    from: z.coerce.date().min(new Date(-1), {
      message: 'La fecha no puede ser menor a la actual',
    }),
    to: z.coerce.date(),
    year: z.number({
      invalid_type_error: 'Este campo debe ser numérico',
    }),
  })
  .refine((data) => data.to > data.from, {
    message: 'No puede preceder a fecha desde',
    path: ['to'],
  })

export type Convocatory = z.infer<typeof ConvocatorySchema>
