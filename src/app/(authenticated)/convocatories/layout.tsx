export default function Layout({
  children,
  drawer,
}: {
  children: React.ReactNode
  drawer: React.ReactNode
}) {
  return (
    <>
      {drawer}
      {children}
    </>
  )
}
