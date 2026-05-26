import { getLogs } from '@repositories/log'
import { ViewLogsDialog } from 'modules/logs/view-logs-dialog'

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string }>
}) {
  const resolvedSearchParams = await searchParams
  const logs = await getLogs(resolvedSearchParams)

  return <ViewLogsDialog logs={logs} />
}
