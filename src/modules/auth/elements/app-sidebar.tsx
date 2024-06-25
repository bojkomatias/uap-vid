'use client'
import {
  BuildingCommunity,
  CalendarEvent,
  List,
  UserSearch,
  Users,
  Category,
  CurrencyDollar,
  Logout,
  Settings,
  Businessplan,
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
        {convocatory ?
          <SidebarSection>
            <SidebarHeading>Convocatoria activa</SidebarHeading>
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
    name: 'Proyectos de investigación',
    icon: List,
    href: '/protocols',
    scope: Access.PROTOCOLS,
  },
  {
    name: 'Panel de convocatorias',
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
    name: 'Presupuestos anuales',
    icon: CurrencyDollar,
    href: '/anual-budgets',
    scope: Access.TEAM_MEMBERS,
  },
  {
    name: 'Miembros de investigación',
    icon: UserSearch,
    href: '/team-members',
    scope: Access.TEAM_MEMBERS,
  },
  {
    name: 'Categorías de miembros de equipo de investigación',
    icon: Category,
    href: '/categories',
    scope: Access.TEAM_MEMBERS,
  },
  {
    name: 'Lista de usuarios',
    icon: Users,
    href: '/users',
    scope: Access.USERS,
  },
  {
    name: 'Indices',
    icon: Businessplan,
    href: '/indexes',
    scope: Access.INDEXES,
  },
]
