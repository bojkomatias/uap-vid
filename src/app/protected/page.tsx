import Navigation from '@auth/Navigation'
import { Button } from '@elements/Button'
import { Heading } from '@layout/Heading'

import Table from '@protocol/elements/Table'
import Link from 'next/link'
import { getAllProtocols } from 'repositories/protocol'
import { FilePlus } from 'tabler-icons-react'

// SSR Server Component, so no need to fetch from api endpoint
export default async function Page() {
    const protocols = await getAllProtocols()
    return (
        <Navigation>
            <Heading title="Lista de proyectos de investigación" />
            <p className="mt-2 text-sm text-gray-500">
                Lista de todos los protocolos cargados en el sistema, haz click
                en &apos;ver&apos; para más detalles.
            </p>

            <Link
                href={'/protected/protocol/new'}
                passHref
                className="mt-4 flex"
            >
                <Button intent="primary">
                    <FilePlus className="mr-3 h-5" /> Nueva Postulación
                </Button>
            </Link>

            <div className="mx-auto mb-20 flex flex-col justify-center">
                <Table items={protocols} />
            </div>
        </Navigation>
    )
}
