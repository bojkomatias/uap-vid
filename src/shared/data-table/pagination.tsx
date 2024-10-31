'use client'
import { useMemo } from 'react'
import RecordsDropdown from './records-dropdown'
import { useSearchParams } from 'next/navigation'
import { useUpdateQuery } from 'hooks/updateQuery'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'tabler-icons-react'
import { Button } from '@components/button'
import { cx } from '@utils/cx'
import { Text } from '@components/text'
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

  const shownRecords = Number(searchParams?.get('records')) || 10

  const currentPage = Number(searchParams?.get('page')) || 1

  const { allPages, displayedPages } = useMemo(() => {
    const allPages: number[] = []
    for (let i = 1; i <= Math.ceil(totalRecords / shownRecords); i++) {
      allPages.push(i)
    }

    const floor =
      currentPage - Math.floor(numberOfDisplayedPages / 2) <= 0 ? 0
      : currentPage + Math.ceil(numberOfDisplayedPages / 2) >= allPages.length ?
        allPages.length - numberOfDisplayedPages
      : currentPage - Math.floor(numberOfDisplayedPages / 2)
    const ceil =
      currentPage + Math.ceil(numberOfDisplayedPages / 2) >= allPages.length ?
        allPages.length
      : currentPage - Math.floor(numberOfDisplayedPages / 2) <= 0 ?
        numberOfDisplayedPages
      : currentPage + Math.ceil(numberOfDisplayedPages / 2)

    const displayedPages =
      allPages.length > numberOfDisplayedPages ?
        allPages.slice(floor, ceil)
      : allPages

    return { allPages, displayedPages }
  }, [totalRecords, shownRecords, numberOfDisplayedPages, currentPage])

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="mx-auto flex w-fit gap-1">
        {numberOfDisplayedPages >= Math.ceil(totalRecords / shownRecords) ? null
        : <>
            <Button
              title="Primer página"
              onClick={() => update({ page: '1' })}
              plain
            >
              <ChevronsLeft data-slot="icon" />
            </Button>
            <Button
              title="Página anterior"
              onClick={() =>
                update({
                  page: currentPage > 1 ? (currentPage - 1).toString() : '1',
                })
              }
              plain
            >
              <ChevronLeft data-slot="icon" />
            </Button>
          </>}

        {Math.ceil(totalRecords / shownRecords) >= 1 && allPages.length != 1 ?
          displayedPages.map((page: number) => (
            <Button
              key={page}
              onClick={() => {
                if (Number(currentPage) !== page)
                  update({ page: page.toString() })
              }}
              {...(Number(currentPage) === page ?
                { outline: true }
              : { plain: true })}
            >
              <span
                className={cx(
                  Number(currentPage) === page && '!font-semibold',
                  'w-3.5 font-normal'
                )}
              >
                {page}
              </span>
            </Button>
          ))
        : null}
        {numberOfDisplayedPages >= Math.ceil(totalRecords / shownRecords) ? null
        : <>
            <Button
              title="Siguiente página"
              onClick={() =>
                update({
                  page:
                    currentPage < allPages.length ?
                      (currentPage + 1).toString()
                    : allPages[allPages.length - 1].toString(),
                })
              }
              plain
            >
              <ChevronRight data-slot="icon" />
            </Button>

            <Button
              title="Última página"
              onClick={() =>
                update({
                  page: allPages[allPages.length - 1].toString(),
                })
              }
              plain
            >
              <ChevronsRight data-slot="icon" />
            </Button>
          </>}

        <RecordsDropdown
          options={[10, 20, 50, totalRecords]}
          shownRecords={shownRecords}
          currentPage={currentPage}
        />
      </div>

      <div className="flex gap-1 !text-xs text-gray-700 dark:text-gray-300">
        {shownRecords * Number(searchParams?.get('page') || 1) -
          shownRecords +
          1 <
          totalRecords && (
          <>
            <Text>Mostrando registros</Text>
            <Text className="font-semibold">
              {shownRecords * Number(searchParams?.get('page') || 1) -
                shownRecords +
                1}
              {' a '}
              {(
                shownRecords * Number(searchParams?.get('page') || 1) >=
                totalRecords
              ) ?
                totalRecords
              : shownRecords * Number(searchParams?.get('page') || 1)}{' '}
            </Text>
            <Text>de</Text>
            <Text
              className="cursor-pointer border-b border-b-primary/0 transition-all duration-150 hover:border-b-primary"
              onClick={() =>
                update({
                  records: totalRecords.toString(),
                  page: '1',
                })
              }
            >
              {totalRecords} en total
            </Text>
          </>
        )}
      </div>
    </div>
  )
}
