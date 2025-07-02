import { z } from 'zod'

/////////////////////////////////////////
// TEAM MEMBER CATEGORY SCHEMA
/////////////////////////////////////////

export const TeamMemberCategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: 'El campo no puede ser nulo' }),
  state: z.boolean(),
  amount: z.coerce.number(), //Remove nullable
  specialCategory: z.boolean().optional().default(false),
})

/////////////////////////////////////////
// HISTORIC TEAM MEMBER CATEGORY SCHEMA
/////////////////////////////////////////

export const HistoricTeamMemberCategorySchema = z.object({
  id: z.string(),
  from: z.coerce.date(),
  to: z.coerce.date().nullable(),
  teamMemberId: z.string(),
  categoryId: z.string(),
  pointsObrero: z.number().optional(),
})

/////////////////////////////////////////
// TEAM MEMBER SCHEMA
/////////////////////////////////////////

export const TeamMemberSchema = z.object({
  id: z.string(),
  userId: z.string().nullable(),
  name: z.string().min(1, {
    message: 'No puede estar vació, seleccione usuario o ingrese un nombre.',
  }),
  academicUnitId: z
    .string()
    .min(1, {
      message: 'No puede estar vació, seleccione usuario o ingrese un nombre.',
    })
    .nullable(),
})

/////////////////////////////////////////
// TEAM ASSIGNMENT SCHEMAS
/////////////////////////////////////////

export const TeamAssignmentSchema = z.object({
  categoryToBeConfirmed: z.string().nullable(),
  role: z.string().min(1, { message: 'El campo no puede estar vacío' }),
  hours: z.coerce
    .number({
      invalid_type_error: 'Este campo debe ser numérico',
    })
    .min(1, {
      message: 'Debe ser un numero positivo',
    })
    .max(400, {
      message: 'No se pueden asignar tantas horas',
    }),
  workingMonths: z.coerce.number().default(12).nullable(),
  from: z.coerce.date(),
  to: z.coerce.date().nullable(),
})

export const IdentificationTeamSchema = z.object({
  hours: z.coerce.number().nullable(),
  last_name: z.string().nullable(),
  name: z.string().nullable(),
  role: z.string().min(1, { message: 'El campo no puede estar vacío' }),
  teamMemberId: z.string().nullable(),
  workingMonths: z.coerce.number().default(12).nullable(),
  toBeConfirmed: z.boolean().default(false).nullable(),
  categoryToBeConfirmed: z.string().nullable(),
  assignments: z.array(TeamAssignmentSchema),
})

export const ConfirmTeamSchema = z.object({
  team: z.array(
    z.object({
      teamMemberId: z
        .string()
        .nullable()
        .refine((val) => val !== null && val.length > 0, {
          message: 'Debe seleccionar un miembro de equipo',
        }),
    })
  ),
})

export const TeamMemberRelation = z
  .object({
    hours: z
      .number({
        invalid_type_error: 'Este campo debe ser numérico',
      })
      .min(1, {
        message: 'Debe ser un numero positivo',
      })
      .max(400, {
        message: 'No se pueden asignar tantas horas',
      }),
    last_name: z.string().nullable(),
    name: z.string().nullable(),
    role: z.string().min(1, { message: 'El campo no puede estar vacío' }),
    teamMemberId: z
      .string({
        invalid_type_error:
          'Faltan relacionar miembros del equipo de investigación',
      })
      .min(1, {
        message: 'Faltan relacionar miembros del equipo de investigación',
      }),
  })
  .array()
