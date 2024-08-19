import { getLogs } from '@repositories/log'
import { ViewLogsDialog } from 'modules/logs/view-logs-dialog'
import { redirect } from 'next/navigation'

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string }
}) {
  const logs = await getLogs()

  return <ViewLogsDialog logs={logs} />
}
