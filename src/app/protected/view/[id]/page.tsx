import { Heading } from '@layout/Heading'
import View from '@protocol/View'
import { findProtocolById } from 'repositories/protocol'

export default async function Page({ params }: any) {
    const protocol = await findProtocolById(params.id)

    if (protocol)
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
                        <View protocol={protocol} />
                    </main>
                    <aside className="relative hidden w-96 flex-shrink-0 overflow-y-auto border-l border-gray-200 xl:flex xl:flex-col">
                        <span className="mx-8 text-lg font-semibold">
                            Comments
                        </span>
                        <div className="border-2 border-dashed h-screen m-12 rounded-xl" />
                    </aside>
                </div>
            </>
        )
}
