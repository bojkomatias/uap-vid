import { z } from 'zod'

/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

const RoleSchema = z.enum([
    'RESEARCHER',
    'SECRETARY',
    'METHODOLOGIST',
    'EVALUATOR',
    'ADMIN',
])
export const ROLE = RoleSchema.Enum
export type RoleType = `${z.infer<typeof RoleSchema>}`

const StateSchema = z.enum([
    'NOT_CREATED',
    'DRAFT',
    'METHOD',
    'SCIENTIFIC',
    'ACCEPTED',
    'ONGOING',
])

export const STATE = StateSchema.Enum
export type StateType = `${z.infer<typeof StateSchema>}`
export const stateTranslate = {
    [STATE.NOT_CREATED]: null,
    [STATE.DRAFT]: 'Borrador',
    [STATE.METHOD]: 'En evaluación metodológica',
    [STATE.SCIENTIFIC]: 'En evaluación científica',
    [STATE.ACCEPTED]: 'Aceptado',
    [STATE.ONGOING]: 'Aprobado y en curso',
}
// Schema for Transitions between protocols
const ActionSchema = z.enum([
    'CREATE',
    'VIEW',
    'EDIT',
    'PUBLISH',
    'COMMENT',
    'ACCEPT',
])
export const ACTION = ActionSchema.Enum
export type ActionType = `${z.infer<typeof ActionSchema>}`

const AccessSchema = z.enum(['PROTOCOLS', 'USERS'])
export const ACCESS = AccessSchema.Enum
export type AccessType = `${z.infer<typeof AccessSchema>}`

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

/////////////////////////////////////////
// PROTOCOL SCHEMA
/////////////////////////////////////////

export const ProtocolSchema = z.object({
    id: z.string().optional(),
    createdAt: z.coerce.date().optional(),
    state: StateSchema,
    researcher: z.string(),
    sections: z.lazy(() => SectionsSchema),
})
// .optional() to export type to create a Form (from new object, has no assigned Id yet)
export type Protocol = z.infer<typeof ProtocolSchema>

/////////////////////////////////////////
// REVIEWS SCHEMA
/////////////////////////////////////////

export const ReviewsSchema = z.object({
    id: z.string(),
})

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
    id: z.string(),
    email: z.string(),
    id_: z.string().nullable(),
    image: z.string().nullable(),
    lastLogin: z.coerce.date().nullable(),
    name: z.string().nullable(),
    password: z.string().nullable(),
    role: RoleSchema,
})

/////////////////////////////////////////
// PROTOCOL SECTIONS SCHEMA
/////////////////////////////////////////

export const SectionsSchema = z.object({
    bibliography: z.lazy(() => BibliographySchema),
    budget: z.lazy(() => BudgetSchema),
    description: z.lazy(() => DescriptionSchema),
    duration: z.lazy(() => DurationSchema),
    identification: z.lazy(() => IdentificationSchema),
    introduction: z.lazy(() => IntroductionSchema),
    methodology: z.lazy(() => MethodologySchema),
    publication: z.lazy(() => PublicationSchema),
})

export type Sections = z.infer<typeof SectionsSchema>

/////////////////////////////////////////
// PROTOCOL SECTIONS BIBLIOGRAPHY SCHEMA
/////////////////////////////////////////

export const BibliographySchema = z.object({
    chart: z
        .lazy(() =>
            z.object({
                author: z
                    .string()
                    .min(1, { message: 'El campo no puede estar vació' }),
                title: z
                    .string()
                    .min(1, { message: 'El campo no puede estar vació' }),
                year: z.preprocess(
                    (a) => {
                        if (typeof a === 'string') {
                            return parseInt(a, 10)
                        } else if (typeof a === 'number') {
                            return a
                        }
                    },
                    z
                        .number({
                            invalid_type_error: 'Este campo debe ser numérico',
                        })
                        .max(new Date().getFullYear(), {
                            message: 'No puede ser mayor al año actual',
                        })
                ),
            })
        )
        .array(),
})

/////////////////////////////////////////
// PROTOCOL SECTIONS BUDGET SCHEMA
/////////////////////////////////////////

export const BudgetSchema = z.object({
    expenses: z
        .lazy(() =>
            z.object({
                amount: z.preprocess(
                    (a) => {
                        if (typeof a === 'string') {
                            return parseInt(a, 10)
                        } else if (typeof a === 'number') {
                            return a
                        }
                    },
                    z
                        .number({
                            invalid_type_error: 'Este campo debe ser numérico',
                        })
                        .positive({ message: 'Debe ser mayor que cero' })
                ),
                detail: z
                    .string()
                    .min(1, { message: 'El campo no puede estar vacío' }),
                type: z
                    .string()
                    .min(1, { message: 'El campo no puede estar vacío' }),
                year: z
                    .string()
                    .min(1, { message: 'El campo no puede estar vacío' }),
            })
        )
        .array(),
})

/////////////////////////////////////////
// PROTOCOL SECTIONS DESCRIPTION SCHEMA
/////////////////////////////////////////

export const DescriptionSchema = z.object({
    discipline: z.string(),
    field: z.string(),
    line: z.string(),
    objective: z.string(),
    type: z.string(),
    words: z.string(),
})

/////////////////////////////////////////
// PROTOCOL SECTIONS DURATION SCHEMA
/////////////////////////////////////////

export const DurationSchema = z.object({
    duration: z.string(),
    modality: z.string(),
    chronogram: z
        .lazy(() =>
            z.object({
                semester: z
                    .string()
                    .min(1, { message: 'El campo no puede estar vacío' }),
                task: z
                    .string()
                    .min(1, { message: 'El campo no puede estar vacío' }),
            })
        )
        .array(),
})

/////////////////////////////////////////
// PROTOCOL SECTIONS IDENTIFICATION SCHEMA
/////////////////////////////////////////

export const IdentificationSchema = z.object({
    assignment: z.string(),
    career: z.string().min(1, { message: 'El campo no puede estar vacío' }),
    sponsor: z.string().array(),
    title: z.string().min(6, { message: 'Debe tener al menos 6 caracteres' }),
    team: z
        .lazy(() =>
            z.object({
                hours: z.preprocess(
                    (a) => {
                        if (typeof a === 'string') {
                            return parseInt(a, 10)
                        } else if (typeof a === 'number') {
                            return a
                        }
                    },
                    z
                        .number({
                            invalid_type_error: 'Este campo debe ser numérico',
                        })
                        .min(1, {
                            message: 'Las horas asignadas no pueden ser cero',
                        })
                        .max(400, {
                            message: 'No se pueden asignar tantas horas',
                        })
                ),
                last_name: z
                    .string()
                    .min(1, { message: 'El campo no puede estar vacío' }),
                name: z
                    .string()
                    .min(1, { message: 'El campo no puede estar vacío' }),
                role: z
                    .string()
                    .min(1, { message: 'El campo no puede estar vacío' }),
            })
        )
        .array(),
})

/////////////////////////////////////////
// PROTOCOL SECTIONS INTRODUCTION SCHEMA
/////////////////////////////////////////

export const IntroductionSchema = z.object({
    justification: z.string(),
    objectives: z.string(),
    problem: z.string(),
    state: z.string(),
})

/////////////////////////////////////////
// PROTOCOL SECTIONS METHODOLOGY SCHEMA
/////////////////////////////////////////

export const MethodologySchema = z.object({
    analysis: z.string(),
    considerations: z.string(),
    design: z.string(),
    instruments: z.string(),
    participants: z.string(),
    place: z.string(),
    procedures: z.string(),
    detail: z.string(),
    type: z.string(),
})

/////////////////////////////////////////
// PROTOCOL SECTIONS PUBLICATION SCHEMA
/////////////////////////////////////////

export const PublicationSchema = z.object({
    plan: z.string(),
    result: z.string(),
})
