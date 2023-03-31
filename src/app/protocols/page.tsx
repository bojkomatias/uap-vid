import { PageHeading } from '@layout/page-heading'
import CreateButton from '@protocol/elements/action-buttons/Create'
import Table from '@protocol/elements/Table'
import { getServerSession } from 'next-auth'
import { authOptions } from 'pages/api/auth/[...nextauth]'
import {
    getProtocolsWithoutPagination,
    getProtocolByRol,
    getTotalRecordsProtocol,
} from 'repositories/protocol'
import Pagination from '@elements/pagination'
import SearchBar from '@elements/search-bar'
import fuzzysort from 'fuzzysort'
import { Protocol } from '@prisma/client'
import { canExecute } from '@utils/scopes'
import { ACTION } from '@utils/zod'

// SSR Server Component, so no need to fetch from api endpoint
export default async function Page({
    searchParams,
}: {
    searchParams?: { [key: string]: string }
}) {
    const session = await getServerSession(authOptions)

    const protocolCount = await getTotalRecordsProtocol()
    const shownRecords = 8

    // Since the page refreshes or pushes according to params, I grouped the query through ternaries here.
    const protocols = session?.user
        ? searchParams?.search
            ? await getProtocolsWithoutPagination(
                  session.user.role,
                  session.user.id
              )
            : await getProtocolByRol(
                  session.user.role,
                  session.user.id,
                  Number(searchParams?.page) || 1,
                  shownRecords
              )
        : null
    /**  This is the function that performs the search. Uses fuzzysort library. In the keys array you can put whatever key/s you want the search to be performed onto */
    const searchedProtocols = (): Protocol[] => {
        const results = fuzzysort.go(
            searchParams?.search!,
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
            <PageHeading title="Lista de proyectos de investigación" />
            <p className="mt-2 text-sm text-gray-500">
                Lista de todos los protocolos cargados en el sistema, haz click
                en &apos;ver&apos; para más detalles.
            </p>

            <div className="mt-3 flex justify-end">
                {canExecute(
                    ACTION.CREATE,
                    session?.user?.role!,
                    'NOT_CREATED'
                ) ? (
                    // @ts-expect-error
                    <CreateButton role={session?.user?.role!} />
                ) : null}
            </div>

            <SearchBar />

            <Table
                items={searchParams?.search ? searchedProtocols() : protocols}
            />
            {searchParams?.search ? null : (
                <Pagination
                    pageParams={Number(searchParams?.page) || 1}
                    count={protocolCount!}
                    shownRecords={shownRecords}
                />
            )}
        </>
    )
}
