import UserForm from '@admin/UserForm'
import Heading from '@layout/Heading'

export default function Page() {
    return (
        <div>
            <Heading title="Crear nuevo usuario" />
            <p className="mx-auto mb-3 w-1/2 pt-12 text-xl font-bold text-primary">
                Nuevo usuario
            </p>
            <UserForm />
        </div>
    )
}
