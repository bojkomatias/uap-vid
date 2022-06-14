import { Button } from '../../components/Atomic/Button'
import { useRouter } from 'next/router'
import { ProtocolMetadata } from '../../config/metadata'
import { useSession } from 'next-auth/react'

export default function Page() {
    const { data: session } = useSession()

    console.log(session)

    const content = [
        {
            title: ' Postulación proyecto de investigación',
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
                        clipRule="evenodd"
                    />
                </svg>
            ),
            url: '/protocol/p',
            action: () => createNewProtocol(),
            roles: ['new-user', 'admin'],
        },
        {
            title: ' Lista base de datos evaluadores',
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clipRule="evenodd"
                    />
                </svg>
            ),
            url: '/protocol/p',
            roles: ['admin'],
        },
        {
            title: ' Seguimiento de proyectos aprobados',
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path
                        fillRule="evenodd"
                        d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                    />
                </svg>
            ),
            url: '/protocol/p',
            roles: ['admin'],
        },
        {
            title: ' Informes de avance',
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
                    <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
                </svg>
            ),
            url: '/protocol/p',
            roles: ['admin'],
        },
        {
            title: ' Información de publicaciones científicas',
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2h-1.528A6 6 0 004 9.528V4z" />
                    <path
                        fillRule="evenodd"
                        d="M8 10a4 4 0 00-3.446 6.032l-1.261 1.26a1 1 0 101.414 1.415l1.261-1.261A4 4 0 108 10zm-2 4a2 2 0 114 0 2 2 0 01-4 0z"
                        clipRule="evenodd"
                    />
                </svg>
            ),
            url: '/protocol/p',
            roles: ['admin'],
        },
        {
            title: ' Lista de proyectos de investigación',
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                >
                    <path
                        fillRule="evenodd"
                        d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                        clipRule="evenodd"
                    />
                </svg>
            ),
            url: '/protected/projects',
            roles: ['new-user', 'admin'],
        },
    ]
    const router = useRouter()
    const redirectToProtocol = (id: string) => {
        router.push(`/protected/protocol/${id}/1`)
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
            <div className="-translate-y-12 text-4xl font-bold text-primary">
                Inicio
            </div>
            <div className="flex h-full -translate-y-12 items-center justify-around">
                <div className="my-auto flex min-h-[70vh] cursor-pointer flex-col justify-center text-center font-bold text-primary">
                    {content.map((item) =>
                        item.roles.includes(useSession().data?.user.role) ? (
                            item.action ? (
                                <a key={item.title} onClick={item.action}>
                                    <div className="flex items-center bg-base-100 p-4 uppercase transition-all duration-200 hover:scale-[102%] hover:bg-primary hover:text-white active:scale-[99%]">
                                        {item.icon}
                                        <p className="mx-auto"> {item.title}</p>
                                    </div>
                                </a>
                            ) : (
                                <a key={item.title} href={item.url}>
                                    <div className=" mt-8 flex items-center bg-base-100 p-4 uppercase transition-all duration-200 hover:scale-[102%] hover:bg-primary hover:text-white active:scale-[99%]">
                                        {item.icon}
                                        <p className="mx-auto"> {item.title}</p>
                                    </div>
                                </a>
                            )
                        ) : null
                    )}
                </div>
            </div>
        </>
    )
}

// ! If need use for custom per page layout
// Page.getLayout = function getLayout(page: ReactElement) {
//     return <NestedLayout>{page}</NestedLayout>
// }
