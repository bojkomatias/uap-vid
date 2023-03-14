import type { protocol } from '@prisma/client'

export default function View({ protocol }: { protocol: protocol }) {
    const data = protocol.sections.identification
    return (
        <div className="px-4">
            <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-semibold leading-6 text-gray-900">
                    Identification
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Datos del proyecto
                </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                            Titulo
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                            {data.title}
                        </dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                            Carrera
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                            {data.career}
                        </dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                            Materia
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                            {data.assignment}
                        </dd>
                    </div>
                    <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                            Sponsor
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                            {data.sponsor}
                        </dd>
                    </div>
                    <div className="sm:col-span-2">
                        <dt className="text-sm font-medium text-gray-500">
                            Equipo
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                            <div className="grid grid-cols-1 border mt-2 rounded-lg divide-y">
                                {data.team.map((person) => (
                                    <div
                                        key={person.last_name}
                                        className="relative flex items-center py-4 px-4"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <span
                                                className="absolute inset-0"
                                                aria-hidden="true"
                                            />
                                            <p className="text-sm font-medium text-gray-900">
                                                {person.last_name},{' '}
                                                {person.name}
                                            </p>
                                            <p className="truncate text-sm text-gray-500">
                                                {person.role}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                Horas
                                            </p>
                                            <p className="truncate font-medium text-gray-800 text-right">
                                                {person.hours}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </dd>
                    </div>
                </dl>
            </div>

            <pre className="text-[0.5rem]">
                {JSON.stringify(protocol, null, 2)}
            </pre>
        </div>
    )
}
