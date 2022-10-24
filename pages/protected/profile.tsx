import { useSession, signIn, signOut } from 'next-auth/react'

export default function profile() {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { data: session } = useSession()

    return (
        <>
            <div className="grow">
                <div className=" -translate-y-12 text-4xl font-bold text-primary ">
                    Perfil
                </div>
                <div className="flex h-full -translate-y-8 flex-col p-20 text-primary ">
                    <div className="flex  flex-col">
                        <div className="text-3xl">
                            Email: {session?.user?.email}
                        </div>
                        <div className="text-xl">
                            Rol de usuario: {session?.user?.role}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
