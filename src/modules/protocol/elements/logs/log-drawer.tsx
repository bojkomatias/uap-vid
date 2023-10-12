'use client'
import { Drawer } from '@mantine/core'
import type { Logs } from '@prisma/client'
import { dateFormatter } from '@utils/formatters'
import { useState, useTransition } from 'react'
import { Button } from '@elements/button'
import { newLog } from '@repositories/log'
import { useRouter } from 'next/navigation'
import { Note } from 'tabler-icons-react'

export default function ProtocolLogsDrawer({
    logs,
    userId,
    protocolId,
}: {
    logs: (Logs & { user: { name: string } })[]
    userId: string
    protocolId: string
}) {
    const router = useRouter()
    const [isPending, startTransition] = useTransition()
    const [open, setOpen] = useState(false)
    const closeFn = () => {
        document.getElementById('drawer-overlay')?.classList.add('fade-out')
        document
            .getElementById('drawer-content')
            ?.classList.add('fade-out-right')
        setTimeout(() => {
            setOpen(false)
        }, 300)
    }
    return (
        <>
            <div className="group pointer-events-none relative">
                <div className="invisible absolute -top-1.5 left-3 z-40 truncate rounded-md bg-gray-50 px-3 py-2 text-sm text-black/70 shadow-sm ring-1 transition-all delay-0 group-hover:visible group-hover:delay-500">
                    Observaciones
                </div>
                <button
                    onClick={() => setOpen(true)}
                    className="pointer-events-auto -ml-3 mt-1"
                >
                    <Note className="h-4 w-4 text-gray-500 hover:text-gray-700" />
                </button>
            </div>
            <Drawer.Root
                closeOnEscape
                position="right"
                opened={open}
                onClose={() => closeFn()}
            >
                <Drawer.Overlay id="drawer-overlay" className="fade-in" />
                <Drawer.Content id="drawer-content" className="fade-in-right">
                    <Drawer.Header>
                        <Drawer.Title className="font-semibold text-gray-600">
                            Cambios de estado y Observaciones
                        </Drawer.Title>
                        <Drawer.CloseButton />
                    </Drawer.Header>
                    <Drawer.Body className="mx-3 flex h-[92svh] flex-col gap-10">
                        <div className="space-y-2 overflow-y-auto rounded-md bg-gray-50 p-4 shadow">
                            {logs.length > 0 ? (
                                logs.map((log) => (
                                    <div key={log.id} className="text-black/70">
                                        <div className="flex justify-between">
                                            <span className="text-sm font-medium">
                                                {log.user.name}
                                            </span>
                                            <span className="text-xs font-light">
                                                {dateFormatter.format(
                                                    log.createdAt
                                                )}
                                            </span>
                                        </div>
                                        <span className="border-l-1 pl-3 text-xs">
                                            {log.message.replace('-->', ' a ')}
                                        </span>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center text-sm text-black/60">
                                    No hay cambios de estado ni observaciones
                                </div>
                            )}
                        </div>
                        <span className="flex-grow" />
                        <form
                            onSubmit={(e) => {
                                e.preventDefault()
                                startTransition(async () => {
                                    const res = await newLog({
                                        protocolId,
                                        userId,
                                        // @ts-ignore
                                        message: e.target[0].value,
                                    })
                                    if (res) {
                                        router.refresh()
                                        setTimeout(() => {
                                            closeFn()
                                        }, 2000)
                                    }
                                })
                            }}
                            className="rounded-md bg-gray-50 p-2 shadow"
                        >
                            <label className="label">Agregar observación</label>
                            <textarea
                                name="message"
                                className="input text-sm"
                                placeholder="Escriba sus observaciones ..."
                                required
                            />
                            <Button
                                loading={isPending}
                                type="submit"
                                intent="secondary"
                                className="float-right"
                            >
                                Agregar
                            </Button>
                        </form>
                    </Drawer.Body>
                </Drawer.Content>
            </Drawer.Root>
        </>
    )
}
