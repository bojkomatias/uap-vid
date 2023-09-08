export const dateFormatter = new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
})

export const relativeTimeFormatter = new Intl.RelativeTimeFormat('es-AR')

export const currencyFormatter = new Intl.NumberFormat('es-AR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
})


