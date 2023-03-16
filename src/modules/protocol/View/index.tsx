import type { protocol } from '@prisma/client'
import IdentificationView from '@protocol/View/Sections/IdentificationView'
import BudgetSection from './Sections/BudgetSection'
import DescriptionSection from './Sections/DescriptionSection'
import DurationView from './Sections/DurationView'

export default function View({ protocol }: { protocol: protocol }) {
    const data = protocol.sections.identification
    return (
        <div className="px-4">
            
            <IdentificationView data={protocol.sections.identification} />
            <DurationView data={protocol.sections.duration} />
            <BudgetSection data={protocol.sections.budget} />
            <DescriptionSection data={protocol.sections.description} />
            
            <pre className="text-[0.5rem]">
                {JSON.stringify(protocol, null, 2)}
            </pre>
        </div>
    )
}
