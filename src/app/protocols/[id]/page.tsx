import { Heading } from '@layout/Heading'
import EditButton from '@protocol/elements/action-buttons/Edit'
import PublishButton from '@protocol/elements/action-buttons/Publish'
import View from '@protocol/View'
import { canExecute } from '@utils/scopes'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { findProtocolById } from 'repositories/protocol'

export default async function Page({ params }: { params: { id: string } }) {
    const session = await getServerSession(authOptions)
    const protocol = await findProtocolById(params.id)
    if (!protocol) redirect('/protocols')
    if (!canExecute('VIEW', session?.user?.role!, protocol?.state!))
        redirect('/protocols')

    return (
        <>
            <Heading
                title={
                    <span>
                        Protocolo:{' '}
                        <span className="font-light">
                            {protocol.sections.identification.title}
                        </span>
                    </span>
                }
            />
            <div className="flex h-full">
                <main className="relative z-0 flex-1 overflow-y-auto focus:outline-none">
                    <div className="flex flex-row-reverse items-center mr-3 gap-2">
                        <PublishButton
                            role={session?.user?.role!}
                            protocol={protocol}
                        />
                        <EditButton
                            role={session?.user?.role!}
                            state={protocol.state}
                            id={protocol.id}
                        />
                    </div>
                    <View protocol={protocol} />
                </main>
                <aside className="relative hidden w-96 flex-shrink-0 overflow-y-auto border-l border-gray-200 xl:flex xl:flex-col">
                    <span className="mx-8 text-lg font-semibold">Comments</span>
                    <div className="m-12 h-screen rounded-xl border-2 border-dashed" />
                </aside>
            </div>
        </>
    )
}
