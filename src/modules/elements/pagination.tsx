'use client'
import { useCallback } from 'react'
import { Button } from './button'
import RecordsDropdown from './records-dropdown'
import { useSearchParams } from 'next/navigation'
import { useUpdateQuery } from '@utils/updateQuery'
/**Receives 4 arguments: the current page number (currentPage), the total records count from the db (count), the amount of shown records on a single page (shownRecords) and an optional parameter which is the list length (number of page numbers displayed) which is set by default to 5.*/
export default function Pagination({
    count,
    listLength = 5,
}: {
    count: number
    listLength?: number
}) {
    const update = useUpdateQuery()
    const searchParams = useSearchParams()
    const shownRecords = Number(searchParams.get('records')) || 4
    console.log(count, shownRecords)

    const currentPage = Number(searchParams.get('page')) ?? 1

    const pageNumbers = useCallback(() => {
        const lLength = listLength
        const originalArray: number[] = []
        for (let i = 1; i <= Math.ceil(count / shownRecords); i++) {
            originalArray.push(i)
        }

        const floor =
            currentPage - Math.floor(lLength / 2) <= 0
                ? 0
                : currentPage + Math.ceil(lLength / 2) >= originalArray.length
                ? originalArray.length - lLength
                : currentPage - Math.floor(lLength / 2)
        const ceil =
            currentPage + Math.ceil(lLength / 2) >= originalArray.length
                ? originalArray.length
                : currentPage - Math.floor(lLength / 2) <= 0
                ? 5
                : currentPage + Math.ceil(lLength / 2)

        const pages =
            originalArray.length > lLength
                ? originalArray.slice(floor, ceil)
                : originalArray

        return { originalArray, pages }
    }, [count, shownRecords, listLength, currentPage])

    return (
        <div className="flex flex-col items-center gap-2">
            <div className="mx-auto mt-12 flex w-fit gap-2">
                {listLength >= Math.ceil(count / shownRecords) ? null : (
                    <>
                        <Button
                            title="Primer página"
                            intent="special"
                            onClick={() => update({ page: 1 })}
                        >
                            {'<<'}
                        </Button>

                        <Button
                            title="Página anterior"
                            intent="special"
                            onClick={() =>
                                update({
                                    page: currentPage > 1 ? currentPage - 1 : 1,
                                })
                            }
                        >
                            {'<'}
                        </Button>
                    </>
                )}

                {Math.ceil(count / shownRecords) > 1
                    ? pageNumbers().pages.map((page: number) => (
                          <Button
                              key={page}
                              intent="tertiary"
                              className={
                                  Number(currentPage) === page
                                      ? 'bg-primary text-white'
                                      : ''
                              }
                              onClick={() => update({ page: page })}
                          >
                              {page}
                          </Button>
                      ))
                    : null}
                {listLength >= Math.ceil(count / shownRecords) ? null : (
                    <>
                        <Button
                            title="Siguiente página"
                            intent="special"
                            onClick={() =>
                                update({
                                    page:
                                        currentPage <
                                        pageNumbers().originalArray.length
                                            ? currentPage + 1
                                            : pageNumbers().originalArray[
                                                  pageNumbers().originalArray
                                                      .length - 1
                                              ],
                                })
                            }
                        >
                            {'>'}
                        </Button>

                        <Button
                            title="Última página"
                            intent="special"
                            onClick={() =>
                                update({
                                    page: pageNumbers().originalArray[
                                        pageNumbers().originalArray.length - 1
                                    ],
                                })
                            }
                        >
                            {'>>'}
                        </Button>
                    </>
                )}
                <RecordsDropdown options={[8, 16, 24, 32]} />
            </div>
            <span className="text-sm  text-primary">
                Mostrando registros{' '}
                <span className="font-semibold">
                    {shownRecords * Number(searchParams.get('page') || 1) -
                        shownRecords +
                        1}
                    {' a '}
                    {shownRecords * Number(searchParams.get('page') || 1) >=
                    count
                        ? count
                        : shownRecords *
                          Number(searchParams.get('page') || 1)}{' '}
                    de {count}
                </span>
            </span>
        </div>
    )
}
