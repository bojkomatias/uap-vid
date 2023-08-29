import { PageHeading } from '@layout/page-heading'
import { authOptions } from 'app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import ProfileInfo from 'modules/profile/profile-info'
import Profile from '@auth/profile'

export default async function Page() {
    const session = await getServerSession(authOptions)
    if (!session) return

    return (
        <main className="mx-16">
            <PageHeading title="Perfil" />
            <ProfileInfo user={session.user} />
        </main>
    )
}
