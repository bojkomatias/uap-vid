export function scroll(elementId: string) {
    const element = document.getElementById(elementId)

    element?.addEventListener('wheel', (event) => {
        event.preventDefault()
        element.scrollBy({
            left: event.deltaY < 0 ? -200 : 200,
        })
    })
}
