import { AppLayout } from '@auth/navigation'
import { Breadcrumbs } from '@elements/breadcrumbs'

export default async function RootLayout({
  children,
  drawer,
}: {
  children: React.ReactNode
  drawer: React.ReactNode
}) {
  return (
    <AppLayout>
      <div className="max-lg:hidden ">
        <Breadcrumbs />
      </div>
      {children}
      {drawer}
    </AppLayout>
  )
}
