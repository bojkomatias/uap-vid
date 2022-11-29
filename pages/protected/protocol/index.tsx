import ItemView from '../../../components/Atomic/ProtocolItemView'
import { GetServerSideProps } from 'next'
import { Protocol } from '../../../config/createContext'
import { PropsWithChildren } from 'react'
import { Button } from '../../../components/Atomic/Button'
import Link from 'next/link'

export default function projects({
    protocols = [],
}: PropsWithChildren<{ protocols: Protocol[]  }>) {
    return (
        <div className="transition-all duration-200">
            <div className="-translate-y-12 text-4xl font-bold text-primary">
                Lista de proyectos de investigación
            </div>

            <div className="mx-auto mb-20 flex max-w-[1280px] flex-col justify-center px-20 py-10">
                {protocols && (
                    protocols.map((protocol) => (
                        <div key={protocol._id} className="mt-5">
                            {protocol?.sections[0].data && (
                                <ItemView
                                    dateOfCreation={protocol.createdAt}
                                    identification={protocol.sections[0].data}
                                    _id={protocol._id}
                                />
                            )}
                        </div>
                    ))

                )} 
                
                {!protocols && (
                    <div className="mt-12 flex w-full flex-col items-center gap-12">
                        <p className="text-center font-thin uppercase text-primary">
                            No hay proyectos cargados ...
                        </p>
                        <Link href="/protected" passHref>
                            <Button>Volver</Button>
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export const getServerSideProps = async () => {
    const string = `${process.env.NEXTURL}/api/protocol`
    const data : Protocol[] = await fetch(string).then((res) => res.json())
    console.log('data',data);
    
    const protocols = data.filter((x)=>x.sections)
    // const protocols = data
    //     .map((p: Protocol) => {
    //         return p.data[0].data.every((x: Input) => x.value) ? p : null
    //     })
    //     .filter(Boolean)
    return {
        props: { protocols },
    }
}
