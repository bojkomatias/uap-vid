'use client'

import {
  BuildingCommunity,
  CalendarEvent,
  UserSearch,
  Users,
  FileDollar,
  Logout,
  Settings,
  Coin,
  Notebook,
  Certificate2,
  FileDelta,
} from 'tabler-icons-react'
import { usePathname } from 'next/navigation'
import { Access, type Convocatory, type User } from '@prisma/client'
import { canAccess } from '@utils/scopes'
import {
  Sidebar,
  SidebarBody,
  SidebarSection,
  SidebarItem,
  SidebarLabel,
  SidebarSpacer,
  SidebarDivider,
  SidebarHeading,
} from '@components/sidebar'
import { CurrentConvocatory } from '@convocatory/timer'
import { UserDropdown } from './user-dropdown'
import { signOut } from 'next-auth/react'
import { Listbox } from '@components/listbox'
import { IndexSwapper } from '@shared/index-swapper'

export function AppSidebar({
  user,
  convocatory,
}: {
  user: User
  convocatory: Convocatory | null
}) {
  const pathname = usePathname()

  return (
    <Sidebar>
      <SidebarBody>
        <SidebarSection className="max-lg:hidden">
          <UserDropdown user={user} />
        </SidebarSection>
        <SidebarDivider className="max-lg:hidden" />
        <SidebarSection>
          {navigation.map((item) =>
            canAccess(item.scope, user.role) ?
              <SidebarItem
                key={item.name}
                href={item.href}
                current={pathname?.includes(item.href)}
              >
                <item.icon data-slot="icon" />
                <SidebarLabel>{item.name}</SidebarLabel>
              </SidebarItem>
            : null
          )}
        </SidebarSection>
        {canAccess(Access.INDEXES, user.role) && (
          <SidebarSection>
            <SidebarHeading>Visulizar montos en indices</SidebarHeading>
            <IndexSwapper />
          </SidebarSection>
        )}
        {convocatory ?
          <SidebarSection>
            <SidebarHeading> Convocatoria activa</SidebarHeading>
            <CurrentConvocatory convocatory={convocatory} />
          </SidebarSection>
        : null}
        <SidebarSpacer />
        <SidebarDivider />
        <SidebarSection>
          <SidebarItem href="/profile">
            <Settings data-slot="icon" />
            <SidebarLabel>Cuenta</SidebarLabel>
          </SidebarItem>
          <SidebarItem
            onClick={() => {
              signOut({ callbackUrl: '/' })
            }}
          >
            <Logout data-slot="icon" />
            <SidebarLabel>Cerrar sesión</SidebarLabel>
          </SidebarItem>
        </SidebarSection>
      </SidebarBody>
    </Sidebar>
  )
}

export const navigation = [
  {
    name: 'Proyectos investigación',
    icon: FileDelta,
    href: '/protocols',
    scope: Access.PROTOCOLS,
  },
  {
    name: 'Convocatorias',
    icon: CalendarEvent,
    href: '/convocatories',
    scope: Access.CONVOCATORIES,
  },
  {
    name: 'Unidades académicas',
    icon: BuildingCommunity,
    href: '/academic-units',
    scope: Access.ACADEMIC_UNITS,
  },
  {
    name: 'Carreras y materias',
    icon: Notebook,
    href: '/careers',
    scope: Access.CAREERS,
  },
  {
    name: 'Presupuestos anuales',
    icon: FileDollar,
    href: '/anual-budgets',
    scope: Access.ANUAL_BUDGETS,
  },
  {
    name: 'Miembros de investigación',
    icon: UserSearch,
    href: '/team-members',
    scope: Access.TEAM_MEMBERS,
  },
  {
    name: 'Categorías de miembros de investigación',
    icon: Certificate2,
    href: '/categories',
    scope: Access.TEAM_MEMBERS,
  },
  {
    name: 'Usuarios del sistema',
    icon: Users,
    href: '/users',
    scope: Access.USERS,
  },
  {
    name: 'Indices financieros',
    icon: Coin,
    href: '/indexes',
    scope: Access.INDEXES,
  },
]
