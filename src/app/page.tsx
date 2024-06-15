import { SignIn } from '@auth/sign-in'
import { Footer } from '@layout/footer'

export default async function Page() {
  return (
    <>
      <SignIn />
      <Footer />
    </>
  )
}
