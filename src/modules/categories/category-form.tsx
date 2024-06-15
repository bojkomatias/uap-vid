'use client'
import { Button } from '@elements/button'
import CurrencyInput from '@elements/currency-input'
import { notifications } from '@elements/notifications'
import { useForm, zodResolver } from '@mantine/form'
import { insertCategory } from '@repositories/team-member-category'
import { cx } from '@utils/cx'
import { TeamMemberCategorySchema } from '@utils/zod'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import type { z } from 'zod'

/**The prop column is to set the content as columns instead of rows */
export default function CategoryForm({
  closeInterceptingDrawer,
  column = false,
}: {
  closeInterceptingDrawer?: Function
  column?: boolean
}) {
  const router = useRouter()
  const form = useForm({
    initialValues: { state: true, name: '', price: [] },
    validate: zodResolver(TeamMemberCategorySchema),
    validateInputOnBlur: true,
  })

  const [loading, setLoading] = useState(false)

  const createCategory = async (
    category: z.infer<typeof TeamMemberCategorySchema>
  ) => {
    setLoading(true)
    const created = await insertCategory(category)

    if (created) {
      notifications.show({
        title: 'Categoría creada',
        message: 'Se creo correctamente la categoría',
        intent: 'success',
      })
      setLoading(false)

      //Agregué un timeout porque era demasiado rápido el close
      setTimeout(() => {
        closeInterceptingDrawer && closeInterceptingDrawer(router)
        router.refresh()
        router.push('/categories')
      }, 500)
      return
    }

    notifications.show({
      title: 'Error',
      message: 'No se pudo crear la categoría',
      intent: 'error',
    })
    setLoading(false)
  }

  return (
    <form
      onSubmit={form.onSubmit((values) => createCategory(values))}
      className={cx(
        !column && 'mt-28 place-items-stretch lg:grid lg:grid-cols-2 ',
        'mx-auto  max-w-5xl pt-4 '
      )}
    >
      <div className="m-3 p-1">
        <label htmlFor="name" className="label">
          Nombre
        </label>
        <input
          id="name"
          className="input"
          placeholder="Nombre de la categoría"
          {...form.getInputProps('name')}
        />
        {form.getInputProps('name').error ? (
          <p className="error">*{form.getInputProps('name').error}</p>
        ) : null}
      </div>
      <div className="m-3 p-1">
        <label htmlFor="price" className="label">
          Precio hora
        </label>
        <CurrencyInput
          priceSetter={(e) => {
            form.removeListItem('price', 0)
            // Always delete the prior since only one exists on creation
            form.insertListItem('price', {
              price: e,

              from: new Date(),
              to: null,
            })
          }}
        />
        {form.getInputProps('price').error ||
        form.getInputProps('price.0.price').error ? (
          <p className="error">
            *{form.getInputProps('price').error}
            {form.getInputProps('price.0.price').error}
          </p>
        ) : null}
      </div>

      <Button
        intent="secondary"
        type="submit"
        className={cx(
          column && 'mt-6',
          ' m-4 ml-auto lg:col-start-2 lg:col-end-3 lg:place-self-end'
        )}
        loading={loading}
      >
        Crear categoría
      </Button>
    </form>
  )
}
