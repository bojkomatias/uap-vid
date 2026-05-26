type ChartEntry = {
  author?: string | null
  title?: string | null
  year?: number | string | null
  url?: string | null
}

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')

export const chartToBibliographyHtml = (chart: ChartEntry[] | null | undefined) => {
  if (!chart?.length) return ''

  return chart
    .map((entry) => {
      const author = entry.author?.toString().trim() ?? ''
      const title = entry.title?.toString().trim() ?? ''
      const yearNum = Number(entry.year)
      const year = Number.isFinite(yearNum) && yearNum > 0 ? String(yearNum) : ''
      const url = entry.url?.toString().trim() ?? ''

      let prose = author
      if (year) prose += `${prose ? ' ' : ''}(${year})`
      if (title) prose += `${prose ? '. ' : ''}${title}`

      const safeProse = escapeHtml(prose)
      const isSafeUrl = /^https?:\/\//i.test(url)
      const link =
        url ?
          isSafeUrl ?
            `<a href="${escapeHtml(url)}">${escapeHtml(url)}</a>`
          : escapeHtml(url)
        : ''

      const body =
        link ?
          `${safeProse}${safeProse ? '. ' : ''}${link}`
        : safeProse

      return body ? `<p>${body}</p>` : ''
    })
    .filter(Boolean)
    .join('')
}
