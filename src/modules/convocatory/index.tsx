import { Convocatory } from '@prisma/client'
import { Timer } from './elements/timer'

export default function CurrentConvocatory({
    convocatory,
}: {
    convocatory: Convocatory
}) {
    return (
        <div>
            <Timer label="Convocatoria termina:" dateString={convocatory.to} />
            <Timer
                label="Convocatoria comienza:"
                dateString={convocatory.from}
            />
        </div>
    )
}
