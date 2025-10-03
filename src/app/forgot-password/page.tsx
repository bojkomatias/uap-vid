import { ForgotPassword } from '@auth/forgot-password'

export default async function Page() {
  return (
    <div className="min-h-screen py-24">
      <ForgotPassword />
    </div>
  )
}
