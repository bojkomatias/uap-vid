import { useRouter } from 'next/navigation'
import { Button } from './Button'
import { ArrowBadgeLeft } from 'tabler-icons-react'
import { ArrowBackUp } from 'tabler-icons-react'

export default function BackButton({ class_name }: { class_name: string }) {
    const router = useRouter()

    function handleClick() {
        router.back()
    }

    return (
        <Button
            className={`${class_name} group w-full`}
            intent="terciary"
            onClick={handleClick}
        >
            <ArrowBackUp className="mx-2 w-4 transition-all duration-150 group-hover:-translate-x-2"></ArrowBackUp>{' '}
            Ir hacia atrás
        </Button>
    )
}
