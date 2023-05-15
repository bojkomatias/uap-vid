export const dateFormatter = new Intl.DateTimeFormat('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
})

export const relativeTimeFormatter = new Intl.RelativeTimeFormat('es-AR')

export const currencyFormatter = (value: number | string) => {
    if (typeof value === 'number') {
        return `$${value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
    } else {
        return `$${value.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}`
    }
}
