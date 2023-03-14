'use client'
import { Button } from '@elements/Button'
import Modal from '@elements/Modal'
import { initialProtocolValues } from 'utils/createContext'
import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'
import { ClipboardPlus, FilePlus } from 'tabler-icons-react'

export default function NewProtocolButton() {
    const router = useRouter()
    const [show, setShow] = useState(false)
    const [title, setTitle] = useState('')

    const createNewProtocol = useCallback(
        async (title: string) => {
            const protocol = initialProtocolValues
            protocol.sections.identification.title = title

            const res = await fetch('/api/protocol', {
                method: 'POST',
                mode: 'cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(protocol),
            })
            const data = await res.json()

            router.push(`/protected/protocol/${data.insertedId}`)
        },

        []
    )

    return (
        <div className="flex flex-row-reverse">
            <Button intent="primary" onClick={() => setShow(true)}>
                <FilePlus className="h-6 mr-3" /> Nueva Postulación
            </Button>
            <Modal
                open={show}
                icon={<ClipboardPlus className="h-6 text-primary" />}
                title="Crear nueva postulación"
            >
                <input
                    type="text"
                    placeholder="Titulo"
                    className="input"
                    onChange={(e) => setTitle(e.target.value)}
                />
                <div className="mt-3 flex text-right">
                    <Button
                        className="my-2 bg-primary/90 text-xs font-semibold text-white"
                        onClick={() => {
                            if (title.length > 0) createNewProtocol(title)
                        }}
                    >
                        Crear
                    </Button>
                    <Button
                        className=" my-2 ml-2 text-xs text-base-600 hover:bg-base-200 hover:text-primary"
                        onClick={() => setShow(false)}
                    >
                        Cancelar
                    </Button>
                </div>
            </Modal>
        </div>
    )
}
