import { Heading } from '@layout/Heading'
import { unstable_getServerSession } from 'next-auth'

export default async function profile() {
    const session = await unstable_getServerSession()
    console.log(session)

    return (
        <>
            <div className="grow">
                <Heading title="Perfil" />
                <div className="flex h-full -translate-y-8 flex-col p-20 text-primary ">
                    <div className="flex  flex-col">
                        <div className="text-3xl">
                            Email: <pre>{JSON.stringify(session)}</pre>
                        </div>
                        <div className="text-xl">
                            Role: <pre>{JSON.stringify(session)}</pre>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
