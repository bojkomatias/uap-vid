import { z } from 'zod'
import { RoleSchema } from './enums'

/////////////////////////////////////////
// USER SCHEMAS
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
  .refine((values) => values.newPassword !== values.currentPassword, {
    message: 'No puede ser la misma contraseña que la actual',
    path: ['newPassword'],
  })
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
