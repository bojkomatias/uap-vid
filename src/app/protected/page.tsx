import { Heading } from '@layout/Heading'
import ItemView from '@protocol/ItemView'
import NewProtocolButton from '@protocol/NewProtocolButton'
import Link from 'next/link'
import { getAllProtocols } from 'repositories/protocol'

// SSR Server Component, so no need to fetch from api endpoint
export default async function Page() {
    // Get protocol according to page and role
    const protocols = await getAllProtocols()
    return (
        <div className="transition-all duration-200">
            <Heading title="Lista de proyectos de investigación" />
            <NewProtocolButton />

            <div className="mx-auto mb-20 flex max-w-7xl flex-col justify-center px-20 py-10">
                {protocols &&
                    protocols.map((protocol) => (
                        <div key={protocol.id} className="mt-5">
                            {protocol?.sections[0].data && (
                                <ItemView
                                    dateOfCreation={protocol.createdAt}
                                    identification={protocol.sections[0].data}
                                    id={protocol.id}
                                />
                            )}
                        </div>
                    ))}

                {!protocols && (
                    <div className="mt-12 flex w-full flex-col items-center gap-12">
                        <p className="text-center font-thin uppercase text-primary">
                            No hay proyectos cargados ...
                        </p>
                        <Link href="/protected">Volver</Link>
                    </div>
                )}
            </div>
        </div>
    )
}
