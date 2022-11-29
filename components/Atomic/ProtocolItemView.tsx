import Link from 'next/link'
import React, { useState, PropsWithChildren } from 'react'
import { Input, Section } from '../../config/createContext'
import { Button } from './Button'

export default function ItemView({
    dateOfCreation,
    identification,
    id,
}: PropsWithChildren<{
    dateOfCreation: Date
    identification: Input
    id: any
}>) {
    const falseStyle =
        'opacity-0 transition-all duration-300 transition-height duration-500 break-words max-h-0 pointer-events-none text-primary'
    const trueStyle =
        'opacity-1 transition-all duration-500 break-words max-h-72 transition-height duration-500 text-primary '
    const tStyle =
        ' border border-primary p-5 transition-all duration-200 text-primary'
    const fStyle =
        ' p-2 border-base-200 transition-all duration-200  border-base-200 border hover:border-primary hover:shadow-md text-primary '

    const [show, setShow] = useState(false)

    return (
        <div>
            <span className="cursor-pointer " onClick={() => setShow(!show)}>
                <div className={show ? tStyle : fStyle}>
                    <div
                        className={
                            show
                                ? 'flex flex-col justify-between text-xl font-bold transition-all duration-200 md:flex-row'
                                : 'text-md group flex flex-col justify-between font-bold transition-all duration-200 md:flex-row'
                        }
                    >
                        <div>
                            <p>{identification.title} </p>{' '}
                            <p
                                className={
                                    show
                                        ? 'ml-1 text-sm transition-all duration-500'
                                        : 'ml-1 text-sm font-normal transition-all duration-500'
                                }
                            >
                                Facultad: {identification.sponsor}
                            </p>
                        </div>
                        <div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={
                                    show
                                        ? 'mr-5 hidden h-5 w-5 rotate-180 fill-primary transition-all duration-500 md:block'
                                        : 'mr-5 hidden h-5 w-5 fill-base-400 transition-all duration-300 group-hover:fill-primary md:block'
                                }
                                viewBox="0 0 20 20"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </div>
                    </div>

                    <div className={show ? trueStyle : falseStyle}>
                        <div className="flex flex-col">
                            {' '}
                            <div className=" mt-1 ml-4 text-sm font-semibold text-primary">
                                {new Date(dateOfCreation).toLocaleDateString(
                                    'es-ar'
                                )}
                            </div>
                            <div className="mt-1 items-start justify-between gap-1 md:flex">
                                <div className="ml-4 w-[70%] text-sm">
                                    Carrera:{' '}
                                    <span className="underline">
                                        {identification.career}
                                    </span>{' '}
                                    <br />
                                </div>
                                <div className="mt-2 mr-5 mb-1">
                                    <Link
                                        href={`/protected/protocol/${id}`}
                                        passHref
                                    >
                                        <Button> Ver todos los detalles</Button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </span>
        </div>
    )
}
