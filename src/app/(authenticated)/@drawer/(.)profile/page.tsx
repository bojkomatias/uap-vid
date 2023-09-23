import { authOptions } from 'app/api/auth/[...nextauth]/route'
import { getServerSession } from 'next-auth'
import ProfileDrawer from 'modules/profile/profile-info-drawer'

export default async function Page() {
    const session = await getServerSession(authOptions)
    if (!session) return

    return <ProfileDrawer user={session.user} />
}
