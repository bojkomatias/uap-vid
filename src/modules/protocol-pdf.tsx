'use client'

import { Button } from '@components/button'

export const PDF = () => {
    return (
        <Button
            className="float-right print:hidden"
            color="light"
            onClick={() => {
                window.print()
            }}
        >
            Descargar PDF
        </Button>
    )
}
