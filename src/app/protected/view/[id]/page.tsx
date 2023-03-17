import { Heading } from '@layout/Heading'
import View from '@protocol/View'
import ReviewForm from '@review/form'
import { findProtocolById } from 'repositories/protocol'

export default async function Page({ params }: { params: { id: string } }) {
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
                <div className="flex h-full ">
                    <main className="relative z-0 flex-1 overflow-y-auto focus:outline-none">
                        <View protocol={protocol} />
                    </main>
                    <button></button>
                    <aside className="relative hidden w-96 flex-shrink-0 overflow-y-auto border-l border-gray-200 xl:flex xl:flex-col">
                        <ReviewForm />
                    </aside>
                </div>
            </>
        )
}

{
    /*  */
}
