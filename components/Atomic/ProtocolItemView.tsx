import React, { useState, PropsWithChildren } from 'react'
import { Section } from '../../config/types'

export default function faq({
    identification,
    _id,
}: PropsWithChildren<{ identification: Section; _id: any }>) {
    const falseStyle =
        'opacity-0 transition-all duration-300 transition-height duration-500 break-words max-h-0 pointer-events-none text-primary'
    const trueStyle =
        'opacity-1 transition-all duration-500 break-words max-h-72 transition-height duration-500 text-primary'
    const tStyle =
        ' border border-primary p-2 transition-all duration-200 text-primary'
    const fStyle =
        ' p-2 border-white transition-all duration-200  border-base-200 border hover:border-primary  text-primary'

    const [show, setShow] = useState(false)

    return (
        <div>
            <a className="cursor-pointer " onClick={() => setShow(!show)}>
                <div className={show ? tStyle : fStyle}>
                    <div
                        className={
                            show
                                ? 'flex justify-between text-xl font-bold transition-all duration-200'
                                : 'group flex justify-between text-sm font-bold transition-all duration-200'
                        }
                    >
                        <div>
                            <p>{identification?.data[0].value} </p>{' '}
                            <p
                                className={
                                    show
                                        ? 'text-sm transition-all duration-500'
                                        : 'text-xs font-normal transition-all duration-500'
                                }
                            >
                                {identification?.data[1].value}
                            </p>
                        </div>
                        <div>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={
                                    show
                                        ? 'mr-5 h-5 w-5 rotate-180 fill-primary transition-all duration-500'
                                        : 'mr-5 h-5 w-5 fill-base-400 transition-all duration-300 group-hover:fill-primary'
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
                            <div className="text-xs font-bold">
                                <p>11/06/2017</p>
                            </div>
                            <div className="flex items-end justify-between gap-1">
                                {' '}
                                <div className="mt-2 w-[70%]"></div>
                                <div className="mt-2 mr-5 mb-1">
                                    <a
                                        href={`/protected/protocol/${_id}/1`}
                                        className="flex-grow-0 items-end bg-primary p-2 text-sm text-white transition-all duration-300 hover:bg-primary-200-700 "
                                    >
                                        Ver todos los detalles
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    )
}
