import Navigation from '@auth/Navigation'
import { Button } from '@elements/Button'
import { Heading } from '@layout/Heading'
import ItemView from '@protocol/ItemView'
import Link from 'next/link'
import { getAllProtocols } from 'repositories/protocol'
import { FilePlus } from 'tabler-icons-react'

// SSR Server Component, so no need to fetch from api endpoint
export default async function Page() {
    const protocols = await getAllProtocols()
    return (
        <Navigation>
            <Heading title="Lista de proyectos de investigación" />

            <Link
                href={'/protected/protocol/new'}
                passHref
                className="flex flex-row-reverse"
            >
                <Button intent="primary">
                    <FilePlus className="h-6 mr-3" /> Nueva Postulación
                </Button>
            </Link>

            <div className="mx-auto mb-20 flex max-w-7xl flex-col justify-center px-20 py-10">
                {protocols &&
                    protocols.map((protocol) => (
                        <div key={protocol.id} className="mt-5">
                            {protocol?.sections && (
                                <ItemView
                                    dateOfCreation={protocol.createdAt}
                                    identification={
                                        protocol.sections.identification
                                    }
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
        </Navigation>
    )
}
