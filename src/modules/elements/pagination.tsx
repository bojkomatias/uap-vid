'use client'
import { useMemo } from 'react'
import { Button } from './button'
import RecordsDropdown from './records-dropdown'
import { useSearchParams } from 'next/navigation'
import { useUpdateQuery } from '@utils/query-helper/updateQuery'
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from 'tabler-icons-react'
/**Receives 4 arguments: the current page number (currentPage), the total records totalRecords from the db (totalRecords), the amount of shown records on a single page (shownRecords) and an optional parameter which is the list length (number of page numbers displayed) which is set by default to 5.*/
export default function Pagination({
    totalRecords,
    numberOfDisplayedPages = 5,
}: {
    totalRecords: number
    numberOfDisplayedPages?: number
}) {
    const update = useUpdateQuery()
    const searchParams = useSearchParams()

    const shownRecords = Number(searchParams?.get('records')) || 5

    const currentPage = Number(searchParams?.get('page')) || 1

    const { allPages, displayedPages } = useMemo(() => {
        const allPages: number[] = []
        for (let i = 1; i <= Math.ceil(totalRecords / shownRecords); i++) {
            allPages.push(i)
        }

        const floor =
            currentPage - Math.floor(numberOfDisplayedPages / 2) <= 0
                ? 0
                : currentPage + Math.ceil(numberOfDisplayedPages / 2) >=
                  allPages.length
                ? allPages.length - numberOfDisplayedPages
                : currentPage - Math.floor(numberOfDisplayedPages / 2)
        const ceil =
            currentPage + Math.ceil(numberOfDisplayedPages / 2) >=
            allPages.length
                ? allPages.length
                : currentPage - Math.floor(numberOfDisplayedPages / 2) <= 0
                ? numberOfDisplayedPages
                : currentPage + Math.ceil(numberOfDisplayedPages / 2)

        const displayedPages =
            allPages.length > numberOfDisplayedPages
                ? allPages.slice(floor, ceil)
                : allPages

        return { allPages, displayedPages }
    }, [totalRecords, shownRecords, numberOfDisplayedPages, currentPage])

    return (
        <div className="flex flex-col items-center gap-2">
            {}
            <div className="mx-auto mt-12 flex w-fit gap-2">
                {numberOfDisplayedPages >=
                Math.ceil(totalRecords / shownRecords) ? null : (
                    <>
                        <Button
                            title="Primer página"
                            intent="outline"
                            className="bg-gray-100"
                            onClick={() => update({ page: 1 })}
                        >
                            <ChevronsLeft className="w-4 text-gray-500" />
                        </Button>

                        <Button
                            title="Página anterior"
                            intent="outline"
                            className="bg-gray-100"
                            onClick={() =>
                                update({
                                    page: currentPage > 1 ? currentPage - 1 : 1,
                                })
                            }
                        >
                            <ChevronLeft className="w-3.5 text-gray-500" />
                        </Button>
                    </>
                )}

                {Math.ceil(totalRecords / shownRecords) > 1 &&
                shownRecords * Number(searchParams?.get('page') || 1) -
                    shownRecords +
                    1 <
                    totalRecords
                    ? displayedPages.map((page: number) => (
                          <Button
                              key={page}
                              intent="outline"
                              className={
                                  Number(currentPage) === page
                                      ? 'fade-in ring ring-primary'
                                      : 'fade-in'
                              }
                              onClick={() => update({ page: page })}
                          >
                              {page}
                          </Button>
                      ))
                    : null}
                {numberOfDisplayedPages >=
                Math.ceil(totalRecords / shownRecords) ? null : (
                    <>
                        <Button
                            title="Siguiente página"
                            intent="outline"
                            className="bg-gray-100"
                            onClick={() =>
                                update({
                                    page:
                                        currentPage < allPages.length
                                            ? currentPage + 1
                                            : allPages[allPages.length - 1],
                                })
                            }
                        >
                            <ChevronRight className="w-3.5 text-gray-500" />
                        </Button>

                        <Button
                            title="Última página"
                            intent="outline"
                            className="bg-gray-100"
                            onClick={() =>
                                update({
                                    page: allPages[allPages.length - 1],
                                })
                            }
                        >
                            <ChevronsRight className="w-4 text-gray-500" />
                        </Button>
                    </>
                )}
                <RecordsDropdown
                    options={[5, 10, 15, 20, totalRecords]}
                    shownRecords={shownRecords}
                    currentPage={currentPage}
                />
            </div>
            <span className="flex  gap-1 text-xs text-black">
                {shownRecords * Number(searchParams?.get('page') || 1) -
                    shownRecords +
                    1 <
                    totalRecords && (
                    <>
                        Mostrando registros
                        <span className="font-semibold">
                            {shownRecords *
                                Number(searchParams?.get('page') || 1) -
                                shownRecords +
                                1}
                            {' a '}
                            {shownRecords *
                                Number(searchParams?.get('page') || 1) >=
                            totalRecords
                                ? totalRecords
                                : shownRecords *
                                  Number(searchParams?.get('page') || 1)}{' '}
                        </span>
                        de{' '}
                        <p
                            className="cursor-pointer border-b border-b-primary/0 transition-all duration-150 hover:border-b-primary"
                            onClick={() =>
                                update({
                                    records: totalRecords,
                                })
                            }
                        >
                            {totalRecords} en total
                        </p>
                    </>
                )}
            </span>
        </div>
    )
}
