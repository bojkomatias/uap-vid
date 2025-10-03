import { ResetPassword } from '@auth/reset-password'
import { Suspense } from 'react'

export default async function Page() {
  return (
    <div className="min-h-screen py-24">
      <Suspense fallback={<div>Cargando...</div>}>
        <ResetPassword />
      </Suspense>
    </div>
  )
}
