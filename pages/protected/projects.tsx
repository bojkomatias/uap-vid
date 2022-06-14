import React, { useEffect } from 'react'
import ItemView from '../../components/Atomic/ProtocolItemView'
import { GetServerSideProps } from 'next'
import { Protocol } from '../../config/types'

export default function projects({ protocols }: any) {
    console.log(protocols)

    return (
        <div className="transition-all duration-200">
            <div className="mx-auto mb-20 flex w-[1280px] flex-col justify-center px-20 py-10">
                {protocols.map((item: Protocol) => (
                    <div key={item._id} className="mt-5">
                        {/* Se busca del protocolo solo la primera seccion, que tiene los datos de identirficacion */}
                        {item.data && item.data[0] ? (
                            <ItemView
                                identification={item.data[0]}
                                _id={item._id}
                            ></ItemView>
                        ) : null}
                    </div>
                ))}
            </div>
        </div>
    )
}

export const getServerSideProps: GetServerSideProps = async () => {
    const string = `${process.env.NEXTURL}/api/protocol/`
    const data = await fetch(string).then((res) => res.json())
    return {
        props: { protocols: data },
    }
}
