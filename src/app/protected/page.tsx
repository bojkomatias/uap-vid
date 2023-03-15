import Navigation from '@auth/Navigation'
import { Button } from '@elements/Button'
import { Heading } from '@layout/Heading'

import Table from '@protocol/Table'
import Link from 'next/link'
import { getAllProtocols } from 'repositories/protocol'
import { FilePlus } from 'tabler-icons-react'

// SSR Server Component, so no need to fetch from api endpoint
export default async function Page() {
    const protocols = await getAllProtocols()
    return (
        <Navigation>
            <Heading title="Lista de proyectos de investigación" />
            <p className="mt-2 text-sm text-gray-700">
                Lista de todos los protocolos cargados en el sistema, haz click
                en &apos;ver&apos; para más detalles.
            </p>

            <Link
                href={'/protected/protocol/new'}
                passHref
                className="flex flex-row-reverse"
            >
                <Button intent="primary">
                    <FilePlus className="h-5 mr-3" /> Nueva Postulación
                </Button>
            </Link>

            <div className="mx-auto mb-20 flex flex-col justify-center">
                <Table items={protocols} />
            </div>
        </Navigation>
    )
}
