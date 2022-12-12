import { SignIn } from '@auth/SignIn'
import { unstable_getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function Page() {
    const session = await unstable_getServerSession()
    if (session) redirect('/protected')
    return <SignIn />
}
