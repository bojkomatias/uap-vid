import type { ReactNode } from 'react'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { AppSidebar } from './elements/app-sidebar'
import { getCurrentConvocatory } from '@repositories/convocatory'
import { authOptions } from 'app/api/auth/[...nextauth]/auth'
import { SidebarLayout } from '@components/sidebar-layout'
import { Breadcrumbs } from '@elements/breadcrumbs'

export async function AppLayout({ children }: { children: ReactNode }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/')

  const convocatory = await getCurrentConvocatory()

  return (
    <SidebarLayout
      sidebar={<AppSidebar user={session.user} convocatory={convocatory} />}
      navbar={<Breadcrumbs />} // We can add later if need be
    >
      {children}
    </SidebarLayout>
  )
}
