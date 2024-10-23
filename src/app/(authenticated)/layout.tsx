import { AppLayout } from '@auth/navigation'
import { Breadcrumbs } from '@elements/breadcrumbs'

export default async function RootLayout({
  children,
  dialog,
}: {
  children: React.ReactNode
  dialog: React.ReactNode
}) {
  return (
    <AppLayout>
      <div className="max-lg:hidden">
        <Breadcrumbs />
      </div>
      {dialog}
      {children}
    </AppLayout>
  )
}
