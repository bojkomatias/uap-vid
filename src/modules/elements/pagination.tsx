import { useCallback } from 'react'
import Link from 'next/link'
import { Button } from './button'
/**Receives 4 arguments: the current page number (pageParams), the total records count from the db (count), the amount of shown records on a single page (shownRecords) and an optional parameter which is the list length (number of page numbers displayed) which is set by default to 5.*/
export default function Pagination({
    url,
    pageParams,
    count,
    shownRecords,
    listLength = 5,
}: {
    url: string
    pageParams: number
    count: number
    shownRecords: number
    listLength?: number
}) {
    const pageNumbers = useCallback(() => {
        const lLength = listLength
        const originalArray: number[] = []
        for (let i = 1; i <= Math.ceil(count / shownRecords); i++) {
            originalArray.push(i)
        }

        const floor =
            pageParams - Math.floor(lLength / 2) <= 0
                ? 0
                : pageParams + Math.ceil(lLength / 2) >= originalArray.length
                ? originalArray.length - lLength
                : pageParams - Math.floor(lLength / 2)
        const ceil =
            pageParams + Math.ceil(lLength / 2) >= originalArray.length
                ? originalArray.length
                : pageParams - Math.floor(lLength / 2) <= 0
                ? 5
                : pageParams + Math.ceil(lLength / 2)

        const pages =
            originalArray.length > lLength
                ? originalArray.slice(floor, ceil)
                : originalArray
        console.log(floor, ceil)

        return { originalArray, pages }
    }, [count, shownRecords, listLength, pageParams])

    return (
        <>
            <div className="mx-auto mt-12 flex w-fit gap-2">
                {listLength >= Math.ceil(count / shownRecords) ? null : (
                    <>
                        {' '}
                        <Link href={`${url}?page=${1}`} passHref>
                            <Button title="Primer página" intent="special">
                                {'<<'}
                            </Button>
                        </Link>
                        <Link
                            href={`${url}?page=${
                                pageParams > 1 ? pageParams - 1 : 1
                            }`}
                            passHref
                        >
                            <Button title="Página anterior" intent="special">
                                {'<'}
                            </Button>
                        </Link>
                    </>
                )}

                {Math.ceil(count / shownRecords) > 1
                    ? pageNumbers().pages.map((page: number) => (
                          <Link
                              key={page}
                              href={`${url}?page=${page}`}
                              passHref
                          >
                              <Button
                                  intent="tertiary"
                                  className={
                                      Number(pageParams) === page
                                          ? 'bg-primary text-white'
                                          : ''
                                  }
                              >
                                  {page}
                              </Button>
                          </Link>
                      ))
                    : null}
                {listLength >= Math.ceil(count / shownRecords) ? null : (
                    <>
                        {' '}
                        <Link
                            href={`${url}?page=${
                                pageParams < pageNumbers().originalArray.length
                                    ? pageParams + 1
                                    : pageNumbers().originalArray[
                                          pageNumbers().originalArray.length - 1
                                      ]
                            }`}
                            passHref
                        >
                            <Button title="Siguiente página" intent="special">
                                {'>'}
                            </Button>
                        </Link>
                        <Link
                            href={`${url}?page=${
                                pageNumbers().originalArray[
                                    pageNumbers().originalArray.length - 1
                                ]
                            }`}
                            passHref
                        >
                            <Button title="Última página" intent="special">
                                {'>>'}
                            </Button>
                        </Link>
                    </>
                )}
            </div>
        </>
    )
}
