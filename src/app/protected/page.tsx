import { Button } from '@elements/Button'
import { Heading } from '@layout/Heading'
import CreateButton from '@protocol/elements/action-buttons/Create'
import Table from '@protocol/elements/Table'
import { getServerSession } from 'next-auth'

import Link from 'next/link'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import { getAllProtocols } from 'repositories/protocol'
import { FilePlus } from 'tabler-icons-react'

// SSR Server Component, so no need to fetch from api endpoint
export default async function Page() {
    const session = await getServerSession(authOptions)
    const protocols = await getAllProtocols()
    return (
        <>
            <Heading title="Lista de proyectos de investigación" />
            <p className="mt-2 text-sm text-gray-500">
                Lista de todos los protocolos cargados en el sistema, haz click
                en &apos;ver&apos; para más detalles.
            </p>

            <div className="flex justify-end">
                <CreateButton role={session?.user?.role!} />
            </div>

            <div className="mx-auto mb-20 flex flex-col justify-center">
                <Table items={protocols} role={session?.user?.role!} />
            </div>
        </>
    )
}
