import { PageHeading } from '@layout/page-heading'
import React from 'react'
import { canAccess } from '@utils/scopes'
import { getServerSession } from 'next-auth'
import { authOptions } from 'app/api/auth/[...nextauth]/route'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Tabs from '@elements/tabs'
import AcademicUnitsDictionary from '@utils/dictionaries/AcademicUnitsDictionary'

export default async function Page({
    params,
    children,
}: {
    params: { name: string }
    children: React.ReactNode
}) {
    const session = await getServerSession(authOptions)
    if (!session || !canAccess('MEMBER_CATEGORIES', session.user.role))
        redirect('/protocols')

    const academicUnitsTabs = () => {
        const academicUnits: {
            title: string
            extendedTitle?: string
            href: string
            count?: string
        }[] = []
        Object.keys(AcademicUnitsDictionary).forEach(function (key) {
            academicUnits.push({
                title: key,
                extendedTitle: AcademicUnitsDictionary[key],

                href: `/anual-budgets/${AcademicUnitsDictionary[key]}`,

            })
        })

        return academicUnits
    }

    const tabs = academicUnitsTabs()

    return (
        <>
            <PageHeading title="Presupuestos anuales" />
            <p className="ml-2 text-sm text-gray-500">
                Lista de los presupuestos anuales de los distintos proyectos de
                investigación{' '}
                <Link
                    className="transition hover:underline"
                    href="/protocols?page=1&filter=state&values=ACCEPTED"
                >
                    aceptados
                </Link>
                .
            </p>
            <Tabs params={params} tabs={tabs} />
            {children}
        </>
    )
}
