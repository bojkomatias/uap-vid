import { useCallback } from 'react'
import Link from 'next/link'

import { Button } from './Button'
/**Receives 3 arguments: the current page number (pageParams) and the total records count from the db (count), the amount of shown records on a single page (shownRecords).*/
export default function Pagination({
    pageParams,
    count,
    shownRecords,
}: {
    pageParams: number
    count: number
    shownRecords: number
}) {
    const pageNumber = useCallback(() => {
        let pageArray: number[] = []
        for (let i = 1; i <= Math.ceil(count / shownRecords); i++) {
            pageArray.push(i)
        }
        return pageArray
    }, [count, shownRecords])

    return (
        <div className="mx-auto mt-12 flex w-fit gap-2">
            {Math.ceil(count / shownRecords) > 1
                ? pageNumber().map((page: number) => (
                      <Link
                          key={page}
                          href={`/protocols?page=${page}`}
                          passHref
                      >
                          <Button
                              intent="terciary"
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
        </div>
    )
}
