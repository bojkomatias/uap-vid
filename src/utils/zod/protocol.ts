import { z } from 'zod'
import { BudgetSchema } from './budget'
import { IdentificationTeamSchema } from './team'
import { ProtocolStateSchema } from './enums'

/////////////////////////////////////////
// PROTOCOL SECTIONS SCHEMAS
/////////////////////////////////////////

/////////////////////////////////////////
// BIBLIOGRAPHY SECTION
/////////////////////////////////////////

export const BibliographySchema = z.object({
  chart: z
    .lazy(() =>
      z.object({
        author: z.string().min(1, { message: 'El campo no puede estar vació' }),
        title: z.string().min(1, { message: 'El campo no puede estar vació' }),
        year: z.coerce
          .number({
            invalid_type_error: 'Este campo debe ser numérico',
          })
          .max(new Date().getFullYear(), {
            message: 'No puede ser mayor al año actual',
          }),
      })
    )
    .array(),
})

/////////////////////////////////////////
// DESCRIPTION SECTION
/////////////////////////////////////////

export const DescriptionSchema = z.object({
  discipline: z.string().min(1, { message: 'El campo no puede estar vacío' }),
  field: z.string().min(1, { message: 'El campo no puede estar vacío' }),
  line: z.string().min(1, { message: 'El campo no puede estar vacío' }),
  technical: z
    .string()
    .refine(
      (data) => data.split(' ').length >= 150 && data.split(' ').length <= 250,
      {
        message: 'El resumen técnico debe contener entre 150 - 250 palabras',
      }
    ),
  objective: z.string().min(1, { message: 'El campo no puede estar vacío' }),
  type: z.string().min(1, { message: 'El campo no puede estar vacío' }),
  words: z.string().min(1, { message: 'El campo no puede estar vacío' }),
})

/////////////////////////////////////////
// DURATION SECTION
/////////////////////////////////////////

export const DurationSchema = z.object({
  duration: z.string().min(1, { message: 'El campo no puede estar vacío' }),
  modality: z.string().min(1, { message: 'El campo no puede estar vacío' }),
  chronogram: z
    .lazy(() =>
      z.object({
        semester: z
          .string()
          .min(1, { message: 'El campo no puede estar vacío' }),
        data: z
          .object({
            task: z.string().min(1, {
              message: 'El campo no puede estar vacío',
            }),
          })
          .array(),
      })
    )
    .array(),
})

/////////////////////////////////////////
// IDENTIFICATION SECTION
/////////////////////////////////////////

export const IdentificationSchema = z.object({
  courseId: z.string().nullable().optional(),
  careerId: z
    .string()
    .nullable()
    .optional()
    .refine(
      (value) => value === null || value === undefined || value.length > 0,
      {
        message:
          'Debe seleccionar una carrera que se relacione con el proyecto',
      }
    ),
  academicUnitIds: z
    .string()
    .array()
    .min(1, 'Debe selecionar al menos una unidad académica'),
  title: z.string().min(6, { message: 'Debe tener al menos 6 caracteres' }),
  team: IdentificationTeamSchema.array()
    .min(1, { message: 'Debe tener al menos un integrante' })
    .refine(
      (value) => {
        // Al menos un integrante debe tener el rol de Director
        const hasDirector = value.some(
          (team) => team.role?.trim() === 'Director'
        )
        return hasDirector
      },
      {
        message:
          'Debe tener al menos un miembro del equipo con el rol de Director',
        path: [0, 'role'], // Point to the first team member's role field
      }
    )
    .refine(
      (value) => {
        // Verificar que todos los miembros tengan un nombre o teamMemberId
        return value.every((team) => {
          if (team.toBeConfirmed) {
            return team.categoryToBeConfirmed !== null
          }
          return (
            (team.teamMemberId !== null && team.teamMemberId !== '') ||
            (team.name !== null && team.name !== '')
          )
        })
      },
      {
        message:
          'Todos los miembros del equipo deben tener un nombre o estar seleccionados de la lista',
      }
    ),
})

// Draft schema with more lenient validation
export const IdentificationDraftSchema = z.object({
  courseId: z.string().nullable().optional(),
  careerId: z.string().nullable().optional(), // More lenient for drafts
  academicUnitIds: z.string().array().optional(), // Allow empty for drafts
  title: z.string().min(6, { message: 'Debe tener al menos 6 caracteres' }),
  team: IdentificationTeamSchema.array()
    .min(1, { message: 'Debe tener al menos un integrante' })
    .refine(
      (value) => {
        // Al menos un integrante debe tener el rol de Director
        const hasDirector = value.some(
          (team) => team.role?.trim() === 'Director'
        )
        return hasDirector
      },
      {
        message:
          'Debe tener al menos un miembro del equipo con el rol de Director',
        path: [0, 'role'], // Point to the first team member's role field
      }
    )
    .refine(
      (value) => {
        // Verificar que todos los miembros tengan un nombre o teamMemberId
        return value.every((team) => {
          if (team.toBeConfirmed) {
            return team.categoryToBeConfirmed !== null
          }
          return (
            (team.teamMemberId !== null && team.teamMemberId !== '') ||
            (team.name !== null && team.name !== '')
          )
        })
      },
      {
        message:
          'Todos los miembros del equipo deben tener un nombre o estar seleccionados de la lista',
      }
    ),
})

/////////////////////////////////////////
// INTRODUCTION SECTION
/////////////////////////////////////////

export const IntroductionSchema = z.object({
  justification: z
    .string()
    .min(1, { message: 'El campo no puede estar vacío' }),
  objectives: z.string().min(1, { message: 'El campo no puede estar vacío' }),
  problem: z.string().min(1, { message: 'El campo no puede estar vacío' }),
  state: z.string().min(1, { message: 'El campo no puede estar vacío' }),
})

/////////////////////////////////////////
// METHODOLOGY SECTION
/////////////////////////////////////////

export const MethodologySchema = z.object({
  analysis: z
    .string()
    .min(1, { message: 'El campo no puede estar vacío' })
    .nullable(),
  considerations: z
    .string()
    .min(1, { message: 'El campo no puede estar vacío' })
    .nullable(),
  design: z
    .string()
    .min(1, { message: 'El campo no puede estar vacío' })
    .nullable(),
  instruments: z
    .string()
    .min(1, { message: 'El campo no puede estar vacío' })
    .nullable(),
  participants: z
    .string()
    .min(1, { message: 'El campo no puede estar vacío' })
    .nullable(),
  place: z
    .string()
    .min(1, { message: 'El campo no puede estar vacío' })
    .nullable(),
  procedures: z
    .string()
    .min(1, { message: 'El campo no puede estar vacío' })
    .nullable(),
  detail: z
    .string()
    .min(1, { message: 'El campo no puede estar vacío' })
    .nullable(),
  type: z.string().min(1, { message: 'El campo no puede estar vacío' }),
  humanAnimalOrDb: z.boolean().nullable(),
})

/////////////////////////////////////////
// PUBLICATION SECTION
/////////////////////////////////////////

export const PublicationSchema = z.object({
  title: z.string().min(1, { message: 'El campo no puede estar vacío' }),
  result: z.string().min(1, { message: 'El campo no puede estar vacío' }),
})

/////////////////////////////////////////
// COMBINED SECTIONS SCHEMA
/////////////////////////////////////////

export const SectionsSchema = z
  .object({
    bibliography: z.lazy(() => BibliographySchema),
    budget: z.lazy(() => BudgetSchema),
    description: z.lazy(() => DescriptionSchema),
    duration: z.lazy(() => DurationSchema),
    identification: z.lazy(() => IdentificationSchema),
    introduction: z.lazy(() => IntroductionSchema),
    methodology: z.lazy(() => MethodologySchema),
    publication: z.lazy(() => PublicationSchema),
  })
  .refine(
    (value) => {
      if (
        value.duration.modality ===
        'Proyecto de investigación desde las cátedras (PIC)'
      ) {
        return Boolean(value.identification.courseId)
      }
      return true
    },
    {
      message: 'Campo requerido',
      path: ['identification', 'courseId'],
    }
  )

/////////////////////////////////////////
// PROTOCOL SCHEMA
/////////////////////////////////////////

export const ProtocolSchema = z.object({
  id: z.string().optional(),
  createdAt: z.coerce.date().nullable().optional(),
  state: ProtocolStateSchema,
  researcherId: z.string(),
  sections: z.lazy(() => SectionsSchema),
  convocatoryId: z.string().nullish(),
})
