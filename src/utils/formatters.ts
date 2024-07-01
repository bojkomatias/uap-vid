export const dateFormatter = new Intl.DateTimeFormat('es-AR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
})

export const relativeTimeFormatter = new Intl.RelativeTimeFormat('es-AR')

export const currencyFormatter = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 2,
})

export const dateDifferenceInDays = (date: Date) => {
  const today = new Date()
  const diffTime = Math.abs(date.getTime() - today.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays < 0 ? diffDays : 0
}
