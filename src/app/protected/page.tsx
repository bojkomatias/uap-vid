import Navigation from '@auth/Navigation'
import { Heading } from '@layout/Heading'
import ItemView from '@protocol/ItemView'
import NewProtocolButton from '@protocol/NewProtocolButton'
import Link from 'next/link'
import { getAllProtocols } from 'repositories/protocol'
import Table from '@protocol/Table'

// SSR Server Component, so no need to fetch from api endpoint
export default async function Page() {
    const protocols = await getAllProtocols()
    return (
        <Navigation>
            {/* //! Conditionally render if role allows it */}

            <div className="mx-auto mb-20 flex flex-col justify-center">
                <Table
                    protocols={protocols}
                    title="Listado de proyectos de investigación"
                    description="Lista de todos los protocolos cargados en el sistema, haz click en 'ver' para más detalles."
                ></Table>
            </div>
        </Navigation>
    )
}
