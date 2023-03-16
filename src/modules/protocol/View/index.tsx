import type { protocol } from '@prisma/client'
import IdentificationView from '@protocol/View/Sections/IdentificationView'

export default function View({ protocol }: { protocol: protocol }) {
    const data = protocol.sections.identification
    return (
        <div className="px-4">
            
            <IdentificationView data={protocol.sections.identification} />
            
            <pre className="text-[0.5rem]">
                {JSON.stringify(protocol, null, 2)}
            </pre>
        </div>
    )
}
