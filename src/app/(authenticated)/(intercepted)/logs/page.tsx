import { Heading } from '@components/heading'
import { getLogs } from '@repositories/log'
import { LogCard } from 'modules/logs/view-logs-dialog'
import { redirect } from 'next/navigation'

// No point in accessing it from here! Just do the round trip.
export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string }
}) {
  const logs = await getLogs(searchParams)

  if (!logs) redirect('/protocols')

  return (
    <>
      <Heading>Lista de logs</Heading>
      <div className="mt-8">
        {logs.map((log) => (
          <div key={log.id}>
            <LogCard log={log} />
          </div>
        ))}
      </div>
    </>
  )
}
