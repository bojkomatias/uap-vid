'use client'
import { Button } from '@elements/button'
import PopoverComponent from '@elements/popover'
import { notifications } from '@mantine/notifications'
import { useRouter } from 'next/navigation'
import React, { startTransition } from 'react'
import { Message } from 'tabler-icons-react'

export default function Observation({
    id,
    observations,
}: {
    id: string
    observations?: string[]
}) {
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
            title={<Message className="h-4 text-gray-500" />}
            className="absolute left-0 top-1 rounded-md bg-gray-50 p-2 shadow-md"
            column={true}
            actionButton={
                <Button
                    onClick={() => {
                        const observation = (
                            document.getElementById(
                                'observation'
                            ) as HTMLInputElement
                        ).value

                        if (observation.length > 1)
                            createObservation(id, observation)
                    }}
                    className="float-right px-2.5 py-1 text-xs"
                    intent="outline"
                >
                    Guardar
                </Button>
            }
        >
            <div className="flex gap-2">
                <form className="flex flex-grow flex-col">
                    <label className="label" htmlFor="observation">
                        Nueva observación
                    </label>
                    <textarea
                        rows={3}
                        className="input rounded-md text-xs"
                        id="observation"
                    />
                </form>
                <div className="flex max-h-36 flex-grow flex-col gap-2 overflow-y-auto p-2 text-xs">
                    {observations
                        ?.filter((p) => p)
                        .map((obs, idx) => {
                            return (
                                <div
                                    className="min-w-[100px] rounded-md border border-gray-100 bg-gray-100 p-1"
                                    key={idx}
                                >
                                    {obs}
                                </div>
                            )
                        })}
                </div>
            </div>
        </PopoverComponent>
    )
}
