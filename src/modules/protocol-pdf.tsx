'use client'

import { Button } from '@elements/button'

export const PDF = () => {
    return (
        <Button
            onClick={() => {
                window.print()
            }}
            intent="outline"
            className="float-right mr-3 mt-8 print:hidden"
        >
            Descargar PDF
        </Button>
    )
}
