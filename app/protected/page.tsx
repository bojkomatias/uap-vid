import Navigation from '@auth/Navigation'
import { unstable_getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'

export default async function Page() {
    return (
        <div>
            <>
                <div className="-translate-y-12 text-4xl font-bold text-primary">
                    Inicio
                </div>
                <div className="mt-12 flex h-full -translate-y-12 items-center justify-around ">
                    XD
                    <Navigation />
                    {/* <Modal
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
                </Modal> */}
                </div>
            </>
        </div>
    )
}
