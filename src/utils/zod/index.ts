import { z } from 'zod'

/////////////////////////////////////////
// ENUMS
/////////////////////////////////////////

export const RoleSchema = z.enum([
  'RESEARCHER',
  'SECRETARY',
  'METHODOLOGIST',
  'SCIENTIST',
  'ADMIN',
])

const ProtocolStateSchema = z.enum([
  'DRAFT',
  'PUBLISHED',
  'METHODOLOGICAL_EVALUATION',
  'SCIENTIFIC_EVALUATION',
  'ACCEPTED',
  'ON_GOING',
  'DELETED',
  'DISCONTINUED',
  'FINISHED',
])

// Schema for Transitions between protocols
// const ActionSchema = z.enum([
//     'CREATE',
//     'EDIT',
//     'EDIT_BY_OWNER',
//     'PUBLISH',
//     'ASSIGN_TO_METHODOLOGIST',
//     'ASSIGN_TO_SCIENTIFIC',
//     'REVIEW',
//     'ACCEPT', //This action is made by the secretary. Accept the protocol to be evalualuated by the VID committee
//     'APPROVE', //This approval is made by the admin and approve the protocol and mark it as ON_GOING
//     'DISCONTINUE',
//     'FINISH',
//     'DELETE',
//     'GENERATE_ANUAL_BUDGET',
//     'VIEW_ANUAL_BUDGET',
// ])

// const AccessSchema = z.enum([
//     'PROTOCOLS',
//     'USERS',
//     'EVALUATORS',
//     'REVIEWS',
//     'CONVOCATORIES',
//     'ACADEMIC_UNITS',
//     'TEAM_MEMBERS',
//     'MEMBER_CATEGORIES',
//     'ANUAL_BUDGETS',
// ])

const ReviewTypeSchema = z.enum([
  'METHODOLOGICAL',
  'SCIENTIFIC_INTERNAL',
  'SCIENTIFIC_EXTERNAL',
])

const ReviewVerdictSchema = z.enum(['APPROVED', 'REJECTED', 'PENDING'])

/////////////////////////////////////////
// MODELS
/////////////////////////////////////////

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
    year: z
      .number({
        invalid_type_error: 'Este campo debe ser numérico',
      })
      .min(new Date().getFullYear(), {
        message: 'Debe ser igual o mayor al año actual',
      }),
  })
  .refine((data) => data.to > data.from, {
    message: 'No puede preceder a fecha desde',
    path: ['to'],
  })

export type Convocatory = z.infer<typeof ConvocatorySchema>

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

export const EmailContentTemplateSchema = z.object({
  content: z.string().min(1, { message: 'El campo no puede estar vacío' }),
  subject: z.string().min(1, { message: 'El campo no puede estar vacío' }),
  useCase: z.string(),
  id: z.string().nullable(),
})

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

/////////////////////////////////////////
// REVIEWS SCHEMA
/////////////////////////////////////////

export const ReviewSchema = z.object({
  id: z.string().optional(),
  type: ReviewTypeSchema,
  revised: z.boolean().default(false),
  verdict: ReviewVerdictSchema,
  createdAt: z.coerce.date().optional(),
  updatedAt: z.coerce.date().optional(),
  data: z.string(),
  protocolId: z.string(),
  reviewerId: z.string(),
})

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.string().min(1, { message: 'El campo no puede estar vacío' }),
  email: z.string().min(1, { message: 'El campo no puede estar vacío' }),
  dni: z.number().nullable(),
  id_: z.string().nullable(),
  image: z.string().nullable(),
  lastLogin: z.coerce.date().nullable(),
  name: z.string().nullable(),
  password: z.string().nullable(),
  role: RoleSchema,
})

export const UserPasswordChangeSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, { message: 'Este campo no puede estar vacío' }),
    newPassword: z.string().min(4, {
      message: 'La contraseña debe contener al menos 4 caracteres',
    }),
    newPasswordConfirm: z.string(),
  })
  .refine((values) => values.newPassword === values.newPasswordConfirm, {
    message: 'Las contraseñas no son iguales',
    path: ['newPasswordConfirm'],
  })
  .refine(
    (values) => values.newPassword !== values.currentPassword,

    {
      message: 'No puede ser la misma contraseña que la actual',
      path: ['newPassword'],
    }
  )
//This last check is not a security measure, just a help to the end user if by mistake he's entering the same password as its current one.

export const VerifyUserDataMicrosoftUsersSchema = z.object({
  name: z.string().min(1, { message: 'No puede estar vacío' }),
  dni: z
    .string()
    .min(8, { message: 'Debe tener 8 dígitos' })
    .max(8, { message: 'Debe tener 8 dígitos' }),
})

export const VerifyUserDataSchema = z
  .object({
    name: z.string().min(1, { message: 'No puede estar vacío' }),
    dni: z
      .string()
      .min(8, { message: 'Debe tener 8 dígitos' })
      .max(8, { message: 'Debe tener 8 dígitos' }),

    newPassword: z.string().min(4, {
      message: 'La contraseña debe contener al menos 4 caracteres',
    }),
    newPasswordConfirm: z.string(),
  })
  .refine((values) => values.newPassword === values.newPasswordConfirm, {
    message: 'Las contraseñas no son iguales',
    path: ['newPasswordConfirm'],
  })

export const ReviewQuestionSchema = z.object({
  active: z.boolean(),
  type: z.string(),
  question: z.string(),
})

/////////////////////////////////////////
// HISTORIC INDEX SCHEMA
/////////////////////////////////////////

export const HistoricIndexSchema = z.object({
  from: z.coerce.date(),
  to: z.coerce.date().nullable(),
  price: z.coerce
    .number()
    .min(0, { message: 'El valor no puede ser negativo' }),
})

export const IndexSchema = z.object({
  id: z.string(),
  unit: z.string().min(1, { message: 'El campo no puede ser nulo' }),
  values: HistoricIndexSchema.array().min(1, {
    message: 'El indice debe contener un valor',
  }),
})

/////////////////////////////////////////
// HISTORIC PRICE CATEGORY SCHEMA
/////////////////////////////////////////
export const HistoricCategoryPriceSchema = z.object({
  from: z.coerce.date(),
  to: z.coerce.date().nullable(),
  price: z.number().min(0, { message: 'El valor no puede ser negativo' }),
  currency: z.string().default('ARS'),
})

const AmountIndexSchema = z.object({ FCA: z.number(), FMR: z.number() })

/////////////////////////////////////////
// TEAM MEMBER CATEGORY SCHEMA
// Contiene el array histórico de categorías
/////////////////////////////////////////
export const TeamMemberCategorySchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, { message: 'El campo no puede ser nulo' }),
  state: z.boolean(),
  amount: z.coerce.number(), //Remove nullable
})

/////////////////////////////////////////
// ACADEMIC UNIT BUDGET SCHEMA
/////////////////////////////////////////

export const AcademicUnitBudget = z.object({
  from: z.coerce.date(),
  to: z.coerce.date().nullable(),
  amountIndex: AmountIndexSchema,
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
// PROTOCOL ANUAL BUDGET SCHEMA
/////////////////////////////////////////

export const ProtocolAnualBudgetSchema = z.object({
  id: z.string(),
  protocolId: z.string(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  year: z.number(),
  budgetItems: z
    .object({
      type: z.string(),
      amount: z.number(),
      detail: z.string(),
    })
    .array(),
  budgetTeamMembers: z
    .object({
      teamMemberId: z.string(),
      hours: z.number(),
      remainingHours: z.number(),
    })
    .array(),
})

/////////////////////////////////////////
// PROTOCOL SECTIONS SCHEMA
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
      //Check if the protocol (investigation project) is of PIC type. If it is, enforce the "assignment" field in the validation. If it isn't, it's an optional field.
      if (
        value.duration.modality ===
        'Proyecto de investigación desde las cátedras (PIC)'
      ) {
        if (value.identification.courseId)
          if (value.identification.courseId.length <= 0) return false
          else {
            return true
          }
      } else {
        return true
      }
    },

    {
      message: 'Campo requerido',
      path: ['identification', 'assignment'],
    }
  )

/////////////////////////////////////////
// PROTOCOL SECTIONS BIBLIOGRAPHY SCHEMA
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
// PROTOCOL SECTIONS BUDGET SCHEMA
/////////////////////////////////////////

export const BudgetSchema = z.object({
  expenses: z
    .lazy(() =>
      z.object({
        type: z.string().min(1, { message: 'El campo no puede estar vacío' }),
        data: z
          .object({
            detail: z.string().min(1, {
              message: 'El campo no puede estar vacío',
            }),
            amount: z.coerce
              .number()
              .min(1, { message: 'Debe completar el monto' }),
            year: z
              .string({
                invalid_type_error: 'Debe seleccionar un año',
              })
              .min(1, { message: 'Debe seleccionar un año' }),
          })
          .array(),
      })
    )
    .array(),
})

/////////////////////////////////////////
// PROTOCOL SECTIONS DESCRIPTION SCHEMA
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
// PROTOCOL SECTIONS DURATION SCHEMA
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
// PROTOCOL SECTIONS IDENTIFICATION SCHEMA
/////////////////////////////////////////

export const IdentificationTeamSchema = z.object({
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
  last_name: z.string().nullable(),
  name: z.string().nullable(),
  role: z.string().min(1, { message: 'El campo no puede estar vacío' }),
  teamMemberId: z.string().nullable(),
  workingMonths: z.coerce.number().default(12).nullable(),
  toBeConfirmed: z.boolean().default(false).nullable(),
  categoryToBeConfirmed: z.string().nullable(),
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

export const IdentificationSchema = z.object({
  courseId: z.string().nullable().optional(),
  careerId: z
    .string()
    .min(1, 'Debe seleccionar una carrera que se relacione con el proyecto'),
  academicUnitIds: z
    .string()
    .array()
    .min(1, 'Debe selecionar al menos una unidad académica'),
  title: z.string().min(6, { message: 'Debe tener al menos 6 caracteres' }),
  team: IdentificationTeamSchema.array()
    .min(1, { message: 'Debe tener al menos un integrante' })
    .refine(
      (value) => {
        //Al menos un integrante debe tener el rol de Director,
        const hasDirector = value.some((team) => team.role === 'Director')

        if (!hasDirector) return false
        return true
      },
      { message: 'Debe tener al menos un Director' }
    ),
})

/////////////////////////////////////////
// PROTOCOL SECTIONS INTRODUCTION SCHEMA
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
// PROTOCOL SECTIONS METHODOLOGY SCHEMA
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

/////////////////////////////////////////
// PROTOCOL SECTIONS PUBLICATION SCHEMA
/////////////////////////////////////////

export const PublicationSchema = z.object({
  title: z.string().min(1, { message: 'El campo no puede estar vacío' }),
  result: z.string().min(1, { message: 'El campo no puede estar vacío' }),
})

export const UserEmailChangeSchema = z
  .object({
    currentEmail: z.string().email(),
    newEmail: z.string().email({ message: 'Ingrese un email válido' }),
    emailCode: z.string().min(5, {
      message: 'El código debe contener al menos 5 caracteres',
    }),
  })
  .refine(
    (value) => {
      if (value.currentEmail !== value.newEmail) return true
      else return false
    },
    { message: 'No puede ser el email actual', path: ['newEmail'] }
  )
