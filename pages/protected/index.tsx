import { Button } from '../../components/Atomic/Button'
import { useRouter } from 'next/router'
import { useSession } from 'next-auth/react'
import { initialProtocolValues } from '../../config/createContext'
import Modal from '../../components/Atomic/Modal'
import { ClipboardPlus } from 'tabler-icons-react'
import { useState } from 'react'

export default function Page() {
    const { data: session } = useSession()
    const content = [
        {
            title: 'Postulación proyecto de investigación',
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
            action: () => setShowNewProtocolModal(true),
            roles: [
                'Investigador',
                'Evaluador Interno',
                'Evaluador Externo',
                'Metodólogo',
                'Secretario de Investigación',
                'admin',
            ],
        },
        {
            title: 'Lista base de datos evaluadores',
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
            url: '#',
            roles: ['admin'],
        },
        {
            title: 'Seguimiento de proyectos aprobados',
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
            url: '#',
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
            url: '#',
            roles: ['admin'],
        },
        {
            title: 'Información de publicaciones científicas',
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
            url: '#',
            roles: ['admin'],
        },
        {
            title: 'Lista de proyectos de investigación',
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
            url: '/protected/protocol',
            roles: [
                'Investigador',
                'Evaluador Interno',
                'Evaluador Externo',
                'Metodólogo',
                'Secretario de Investigación',
                'admin',
            ],
        },
        {
            title: 'Crear nuevo usuario',
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="8.5" cy="7" r="4"></circle>
                    <line x1="20" y1="8" x2="20" y2="14"></line>
                    <line x1="23" y1="11" x2="17" y2="11"></line>
                </svg>
            ),
            url: '/protected/admin/newuser',
            roles: ['admin'],
        },
        {
            title: 'Lista de usuarios',
            icon: (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                    <circle cx="9" cy="7" r="4"></circle>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                </svg>
            ),
            url: '/protected/admin/userlist',
            roles: ['admin'],
        },
    ]
    const router = useRouter()
    const [showNewProtocolModal, setShowNewProtocolModal] = useState(false)
    const redirectToProtocol = (id: string) => {
        router.push(`/protected/protocol/${id}`)
    }
    const createNewProtocol = async (title: string) => {
        const protocol = initialProtocolValues
        protocol.sections[0].data.title = title

        const res = await fetch('/api/protocol', {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(protocol),
        })
        const data = await res.json()
        redirectToProtocol(data.insertedId)
    }

    return (
        <>
            {' '}
            <div className="-translate-y-12 text-4xl font-bold text-primary">
                Inicio
            </div>
            <div className="mt-12 flex h-full -translate-y-12 items-center justify-around">
                <div className="my-auto flex min-h-[70vh] w-1/2 cursor-pointer flex-col justify-center text-center font-bold text-primary ">
                    {content.map((item) =>
                        item.roles.includes(session?.user?.role) ? (
                            item.action ? (
                                <span key={item.title} onClick={item.action}>
                                    <div className="flex items-center bg-base-100 p-4 uppercase transition-all duration-200 hover:scale-[102%] hover:bg-primary hover:text-white active:scale-[99%]">
                                        {item.icon}
                                        <p className="mx-auto"> {item.title}</p>
                                    </div>
                                </span>
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
                <Modal
                    open={showNewProtocolModal}
                    icon={<ClipboardPlus className="h-6 w-6 text-primary" />}
                    title="Crear nueva postulación"
                >
                    <form
                        onSubmit={(e) => {
                            if (showNewProtocolModal) {
                                e.preventDefault()
                                createNewProtocol(e.target[0].value)
                            }
                        }}
                    >
                        <input
                            required
                            type="text"
                            placeholder="Titulo"
                            className="input"
                        />
                        <div className="mt-3 flex text-right">
                            <Button
                                className="my-2 bg-primary/90 text-xs font-semibold text-white"
                                type="submit"
                            >
                                Crear
                            </Button>
                            <Button
                                className=" my-2 ml-2 text-xs text-base-600 hover:bg-base-200 hover:text-primary"
                                onClick={() => setShowNewProtocolModal(false)}
                            >
                                Cancelar
                            </Button>
                        </div>
                    </form>
                </Modal>
            </div>
        </>
    )
}

// ! If need use for custom per page layout
// Page.getLayout = function getLayout(page: ReactElement) {
//     return <NestedLayout>{page}</NestedLayout>
// }
