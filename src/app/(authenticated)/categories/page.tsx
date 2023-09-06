import { PageHeading } from '@layout/page-heading'
import { cx } from '@utils/cx'
import { buttonStyle } from '@elements/button/styles'
import Link from 'next/link'
import CategoriesTable from 'modules/categories/team-member-category-table'
import { getCategories } from '@repositories/team-member-category'

export default async function Page({
    searchParams,
}: {
    searchParams: { [key: string]: string }
}) {
    const [totalRecords, categories] = await getCategories(searchParams)

    return (
        <>
            <PageHeading title="Categorías de miembros de equipo de investigación" />
            <p className="ml-2 text-sm text-gray-500">
                Lista de las categorías asignables a los miembros de equipo de
                un proyecto de investigación.
            </p>
            <div className="flex flex-row-reverse">
                <Link
                    href={'/categories/new'}
                    className={cx(
                        buttonStyle('secondary'),
                        'float-right mt-2 w-fit'
                    )}
                >
                    Crear categoría
                </Link>
            </div>
            <CategoriesTable
                categories={categories}
                totalRecords={totalRecords}
            />
        </>
    )
}
