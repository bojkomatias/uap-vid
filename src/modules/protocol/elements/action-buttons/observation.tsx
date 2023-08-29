'use client'
import { Button } from '@elements/button'
import PopoverComponent from '@elements/popover'
import { notifications } from '@mantine/notifications'
import { useRouter } from 'next/navigation'
import React, { startTransition } from 'react'

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
            title="Agregar observación"
            className="absolute left-0 top-2  rounded-md bg-gray-50 p-3 shadow-md"
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
                    Agregar nueva observación
                </Button>
            }
        >
            <div>
                <div className="flex max-h-36 min-w-[150px] flex-grow flex-col gap-2 overflow-y-auto  p-2 text-xs shadow-inner">
                    {observations
                        ?.filter((p) => p)
                        .map((obs, idx) => {
                            return (
                                <div
                                    className="22bg-gray-100 min-w-[100px] rounded-md border border-gray-100 p-1"
                                    key={idx}
                                >
                                    {obs}
                                </div>
                            )
                        })}
                </div>
                <form className="min-w-[200px] flex-grow">
                    <label
                        className="text-xs text-gray-500"
                        htmlFor="observation"
                    >
                        Nueva observación
                    </label>
                    <textarea
                        rows={3}
                        className="input rounded-md text-xs"
                        id="observation"
                    ></textarea>
                </form>
            </div>
        </PopoverComponent>
    )
}
