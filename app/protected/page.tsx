import Navigation from '@auth/Navigation'
import { Heading } from '@layout/Heading'

export default async function Page() {
    return (
        <div>
            <Heading title="Inicio" />
            <div className="flex h-full items-center justify-around">
                <Navigation />
            </div>
        </div>
    )
}
