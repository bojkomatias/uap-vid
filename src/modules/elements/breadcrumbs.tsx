'use client'

import { usePathname } from 'next/navigation'
import { useMemo } from 'react'
import { ChevronRight } from 'tabler-icons-react'
import Link from 'next/link'
import { cx } from '@utils/cx'

type MapLink = { [key: string]: string | undefined }

/** The undefined one are routes that exists but shouldn't be accesible via breadcrumb */
const newLinkMap: MapLink = {
  users: 'Usuarios',
  protocols: 'Protocolos',
  convocatories: 'Convocatorias',
  'academic-units': 'Unidades académicas',
  'team-members': 'Miembros de investigación',
  categories: 'Categorías docentes',
  'anual-budgets': 'Presupuestos anuales',
  budget: undefined,
}
/**
 * Some LOB is needed to check to see if breadcrumbs is View or Edit page [id]
 * */
const previousLink: MapLink = {
  protocols: 'Vista de protocolo',
  convocatories: 'Editar de convocatoria',
  'team-members': 'Editar miembro de equipo',
  'anual-budgets': undefined,
}
const previousSecondLink: MapLink = {
  protocols: 'Edición de protocolo',
  'anual-budgets': 'Vista de presupuesto',
}

export const Breadcrumbs = () => {
  const pathname = usePathname()
  const breadcrumbs = useMemo(
    function generateBreadcrumbs() {
      const asPathNestedRoutes = pathname.split('/').filter((v) => v.length > 0)

      const crumblist = asPathNestedRoutes.map((subpath, idx) => {
        const href = `/${asPathNestedRoutes.slice(0, idx + 1).join('/')}`

        return {
          href,
          name:
            newLinkMap[subpath] ??
            previousLink[asPathNestedRoutes[idx - 1]] ??
            previousSecondLink[asPathNestedRoutes[idx - 2]],
        }
      })

      return crumblist
    },
    [pathname]
  )

  return (
    <nav aria-label="Breadcrumb" className="ml-4 lg:-mt-3 lg:mb-3 lg:ml-0.5">
      <ol role="list" className="flex rounded-md bg-white">
        <li className="flex items-center">
          <Link
            href="/protocols"
            className="text-sm font-medium text-gray-500 hover:text-primary"
          >
            Inicio
          </Link>
        </li>
        {breadcrumbs
          .filter((p) => p.name)
          .map((page) => (
            <li key={page.name} className="flex">
              <div className="flex items-center">
                <ChevronRight className="ml-2 h-4 text-gray-500" />
                <Link
                  href={page.href}
                  className={cx(
                    'ml-4 text-sm font-medium text-gray-500 hover:text-primary',
                    pathname === page.href &&
                      'pointer-events-none text-gray-800 drop-shadow-sm'
                  )}
                >
                  {page.name}
                </Link>
              </div>
            </li>
          ))}
      </ol>
    </nav>
  )
}
