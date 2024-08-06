/* eslint-disable @next/next/no-img-element */
/* eslint-disable jsx-a11y/alt-text */
'use client'
import { Button } from '@components/button'
import type { Review, User } from '@prisma/client'
import { findProtocolById } from '@repositories/protocol'
import { useQuery } from '@tanstack/react-query'
import { FileCertificate } from 'tabler-icons-react'

export const ReviewerCertificate = ({
  reviews,
  user,
}: {
  reviews: Review[]
  user: User
}) => {
  const {
    data: protocols,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ['reviews', reviews],
    queryFn: async () =>
      Promise.all(
        reviews.map(async (r) => await findProtocolById(r.protocolId))
      ),
  })

  const Certificate = () => {
    return (
      <div className=" remove-print-metadata absolute mx-10 -ml-6 flex w-full flex-wrap items-center justify-center text-black opacity-0 print:block print:opacity-100">
        <img className="mx-auto h-[6rem]" src="/UAPazul.png"></img>
        <div className=" mx-10 my-6 text-justify text-sm/5">
          Por medio de la presente se deja constancia que <b>{user.name}</b>,
          <b> DNI {user.dni}</b>, participó como evaluador/a de{' '}
          {reviews.length > 1 ?
            <span className="font-bold">{reviews.length} proyectos </span>
          : <span className="font-bold">un proyecto </span>}{' '}
          de investigación de la Universidad Adventista del Plata:
          <div className="my-6 flex flex-col gap-2 px-2 text-xs italic">
            {protocols?.map((p) => {
              return <div key={p?.id}>-{p?.sections.identification.title}</div>
            })}
          </div>
          A los fines que diere lugar, se extiende la presente constancia en
          <span className="font-semibold">
            {' '}
            Libertador San Martín, Entre Ríos, Argentina, el{' '}
            {new Date().toLocaleDateString()}{' '}
          </span>
          <img
            className="mx-auto mt-8 h-[10rem]"
            src="/CertificateFooter.png"
          ></img>
        </div>
      </div>
    )
  }

  //Check if the user has made reviews. If not, the component will return nothing. If it does, it will show a button where he or her can download the reviewer certificate.
  if (reviews.length == 0) return

  return (
    <>
      <Certificate />
      <Button
        disabled={isLoading || isFetching}
        onClick={() => {
          window.print()
        }}
        outline
        className="mx-auto print:hidden"
      >
        <FileCertificate data-slot="icon" /> Descargar certificado de evaluación
      </Button>
    </>
  )
}
