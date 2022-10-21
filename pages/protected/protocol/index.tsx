import ItemView from '../../../components/Atomic/ProtocolItemView'
import { GetServerSideProps } from 'next'
import { Protocol } from '../../../config/createContext'

export default function projects({ protocols }: any) {
    console.log(protocols)
    return (
        <div className="transition-all duration-200">
            <div className="-translate-y-12 text-4xl font-bold text-primary">
                Lista de proyectos de investigación
            </div>
            <div className="mx-auto mb-20 flex max-w-[1280px] flex-col justify-center px-20 py-10">
                {protocols.map((protocol: Protocol) => (
                    <div key={protocol._id} className="mt-5">
                        {protocol.sections[0].data ? (
                            <ItemView
                                dateOfCreation={protocol.createdAt}
                                identification={protocol.sections[0].data}
                                _id={protocol._id}
                            />
                        ) : (
                            <span className="text-xl font-thin uppercase text-primary">
                                No hay proyectos...
                            </span>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async () => {
    const string = `${process.env.NEXTURL}/api/protocol/`
    const data = await fetch(string).then((res) => res.json())
    // const protocols = data
    //     .map((p: Protocol) => {
    //         return p.data[0].data.every((x: Input) => x.value) ? p : null
    //     })
    //     .filter(Boolean)
    return {
        props: { protocols: data },
    }
}
