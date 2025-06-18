import { z } from 'zod'

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
// ACADEMIC UNIT BUDGET SCHEMA
/////////////////////////////////////////

export const AcademicUnitBudget = z.object({
  from: z.coerce.date(),
  to: z.coerce.date().nullable(),
  amountIndex: AmountIndexSchema,
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
