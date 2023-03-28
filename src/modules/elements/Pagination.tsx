import React from 'react'
import Link from 'next/link'
import clsx from 'clsx'
/**Receives three arguments: the current page number (pageParams) and the total records count from the db (count) and the href to point to the desired url/route whatever you wanna call it.*/
export default function Pagination({
    pageParams,
    count,
    href,
}: {
    pageParams: number
    count: number
    href: string
}) {
    const shownRecords = 2
    const pagination = () => {
        let pageNumber = []
        for (let i = 1; i <= Math.ceil(count / shownRecords); i++) {
            pageNumber.push(i)
        }

        return pageNumber.map((page, idx) => {
            return (
                /*
                For some reason, I couldn't use the Button component here, the Link wouldn't work (didn't throw any error but didn't do anything also)
                */
                <Link
                    key={idx}
                    className={clsx(
                        `rounded-md border border-primary/50 px-3 py-1 transition-all duration-75 hover:border-primary`,
                        Number(pageParams) === page && `bg-primary text-white`
                    )}
                    href={`${href}?page=${page}`}
                >
                    {page}
                </Link>
            )
        })
    }
    return (
        <div className="absolute left-1/2 bottom-20 flex -translate-x-[50%] gap-2">
            {pagination()}
        </div>
    )
}
