import {
    ClipboardList,
    List,
    ListDetails,
    ReportSearch,
    Users,
} from 'tabler-icons-react'
import { ACCESS } from '@utils/zod'

export const navigation = [
    {
        name: 'Proyectos de investigación',
        icon: List,
        href: '/protocols',
        scope: ACCESS.PROTOCOLS,
    },
    {
        name: 'Lista base de datos evaluadores',
        icon: ClipboardList,
        href: '#',
        scope: ACCESS.USERS,
    },
    {
        name: 'Seguimiento de proyectos aprobados',
        icon: ListDetails,
        href: '#',
        scope: ACCESS.USERS,
    },
    {
        name: 'Información de publicaciones científicas',
        icon: ReportSearch,
        href: '#',
        scope: ACCESS.USERS,
    },
    {
        name: 'Lista de usuarios',
        icon: Users,
        href: '/users',
        scope: ACCESS.USERS,
    },
]
