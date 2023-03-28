import { Heading } from '@layout/Heading'
import CreateButton from '@protocol/elements/action-buttons/Create'
import Table from '@protocol/elements/Table'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import {
    getProtocolsWithoutPagination,
    getProtocolByRol,
    getTotalRecordsProtocol,
} from 'repositories/protocol'
import Pagination from '@elements/Pagination'
import SearchBar from '@elements/SearchBar'
import fuzzysort from 'fuzzysort'
import { Protocol } from '@prisma/client'

// SSR Server Component, so no need to fetch from api endpoint
export default async function Page({
    searchParams,
}: {
    searchParams?: { [key: string]: string | string[] | undefined }
}) {
    const session = await getServerSession(authOptions)
    if (!session) return redirect('/login')
    const protocolCount = await getTotalRecordsProtocol()

    const shownRecords = 8

    const protocolsPaginated = session.user
        ? await getProtocolByRol(
              session.user.role,
              session.user.id,
              Number(searchParams?.page) || 1,
              shownRecords
          )
        : []

    //En teoría, el getProtocolsWithoutPagination() solo debería ejecutarse cuando la url tenga el searchParams "search". Calculo que esto debería mejorar la performance del first load de la página.
    const protocols =
        typeof searchParams.search !== 'undefined'
            ? session.user
                ? await getProtocolsWithoutPagination(
                      session.user.role,
                      session.user.id
                  )
                : []
            : []

    /**  This is the function that performs the search. Uses fuzzysort library. In the keys array you can put whatever key/s you want the search to be perfomed onto */
    const searchedProtocols = (): Protocol[] => {
        const results = fuzzysort.go(
            searchParams.search,
            protocols as Protocol[],
            {
                keys: [
                    'sections.identification.title',
                    'sections.identification.career',
                    'sections.identification.assignment',
                ],
            }
        )
        return results.map((result) => {
            return result.obj as Protocol
        })
    }

    return (
        <>
            <Heading title="Lista de proyectos de investigación" />
            <p className="mt-2 text-sm text-gray-500">
                Lista de todos los protocolos cargados en el sistema, haz click
                en &apos;ver&apos; para más detalles.
            </p>


            <div className="mt-3 flex justify-between">
                <SearchBar />
                <CreateButton role={session?.user?.role!} />
            </div>

            <Table
                items={
                    searchParams.search
                        ? searchedProtocols()
                        : protocolsPaginated
                }
            />
            {searchParams.search ? null : (
                <Pagination
                    pageParams={Number(searchParams.page) || 1}
                    count={protocolCount}
                    shownRecords={shownRecords}
                    href="/protocols"
                />
            )}
        </>
    )
}
