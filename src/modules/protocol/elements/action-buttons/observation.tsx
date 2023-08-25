'use client'
import { Button } from '@elements/button'
import PopoverComponent from '@elements/popover'
import { notifications } from '@mantine/notifications'
import { useRouter } from 'next/navigation'
import React, { startTransition } from 'react'

export default function Observation({ id }: { id: string }) {
    const router = useRouter()
    const createObservation = async (id: string, observation: string) => {
        const accepted = await fetch(`/api/protocol/${id}/observation`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(observation),
        })
        if (accepted.ok) {
            notifications.show({
                title: 'Observación guardada',
                message: 'Se agregó correctamente la observación al protocolo',
                color: 'green',
            })
            return startTransition(() => router.refresh())
        }
        return notifications.show({
            title: 'Error',
            message: 'Ocurrió un error al guardar la observación.',
            color: 'red',
        })
    }
    return (
        <PopoverComponent
            title="Agregar observación"
            className="absolute left-0 top-2 min-w-[400px] rounded-md bg-gray-50 p-3 shadow-md"
        >
            <form>
                <label className=" text-xs text-gray-500" htmlFor="observation">
                    Observación
                </label>
                <textarea
                    rows={3}
                    className="input rounded-md text-xs"
                    id="observation"
                ></textarea>
                <Button
                    onClick={() => {
                        const observation = (
                            document.getElementById(
                                'observation'
                            ) as HTMLInputElement
                        ).value

                        createObservation(id, observation)
                    }}
                    className="float-right px-2.5 py-1 text-xs"
                    intent="outline"
                >
                    Guardar
                </Button>
            </form>
        </PopoverComponent>
    )
}
