import { Button } from '../components/Atomic/Button'
import { useRouter } from 'next/router'
import { ProtocolMetadata } from '../config/metadata'

export default function Page() {
    const router = useRouter()
    const redirectToProtocol = (id: string) => {
        router.push(`/protocol/${id}/1`)
    }
    const createNewProtocol = async () => {
        const protocol = ProtocolMetadata
        console.log(protocol)
        const res = await fetch('/api/protocol', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(protocol),
        })
        const data = await res.json()
        console.log(data)
        redirectToProtocol(data.insertedId)
    }

    return (
        <>
            {' '}
            <div className="-translate-y-8 text-4xl font-bold text-primary">
                Inicio
            </div>
            <div className="-translate-y-8 p-10">
                <div className="font-bold text-primary">
                    <Button onClick={() => createNewProtocol()}>
                        Nuevo proyecto de investigación
                    </Button>
                </div>
            </div>
        </>
    )
}

// ! If need use for custom per page layout
// Page.getLayout = function getLayout(page: ReactElement) {
//     return <NestedLayout>{page}</NestedLayout>
// }
