import { getLogs } from '@repositories/log'
import { ViewLogsDialog } from 'modules/logs/view-logs-dialog'

export default async function Page({
  searchParams,
}: {
  searchParams: { [key: string]: string }
}) {
  const logs = await getLogs(searchParams)

  return <ViewLogsDialog logs={logs} />
}
