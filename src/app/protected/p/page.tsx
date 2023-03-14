import { protocol } from '@prisma/client'
import ProtocolForm from '@protocol/Form'
import React from 'react'

const protocol: protocol = {
    id: 'seaseas',
    createdAt: 123,
    sections: {
        identification: {
            assignment: 'Redes y telecomunicaciones III',
            career: 'Sistemas de  Información',
            sponsor:
                'Facultad de Ciencias Económicas y de la Administración (FACEA)',
            team: [
                {
                    hours: '20',
                    last_name: 'Chevalier',
                    name: 'Alicia',
                    role: 'Director',
                },
                {
                    hours: '40',
                    last_name: 'Rey',
                    name: 'Amilcar',
                    role: 'Investigador UAP',
                },
                {
                    hours: '10',
                    last_name: 'Faila',
                    name: 'Damian',
                    role: 'Codirector',
                },
            ],
            title: 'MPLS sobre IPV6',
        },
        duration: {
            chronogram: [
                { semester: '', task: 'Investigación bibliografica' },
                { semester: '2° semestre', task: 'Hipotesis y resultados' },
            ],
            duration: '12 meses',
            modality: 'Proyecto de investigación desde las cátedras (PIC)',
        },
        budget: {
            expenses: [
                {
                    amount: '40000',
                    detail: 'Congreso en la plata',
                    type: 'Viajes',
                    year: '2022',
                },
                {
                    amount: '20000',
                    detail: 'Libros originales',
                    type: 'Libros',
                    year: '2023',
                },
            ],
        },
        description: {
            discipline: 'Ciencias Económicas y de la Administración',
            field: 'Ingeniería y tecnología',
            line: 'Redes y sistemas operativos',
            objective: 'Transporte, telecomunicación y otras infraestructuras',
            type: 'Desarrollo experimental',
            words: 'Redes, MPLS, Ipv6, simulación',
        },
        introduction: {
            justification: '<p>Esto va a funcionar, lo se. </p>',
            objectives:
                '<p>Validar si ipv6 es rentable y aplicable para solucionar los mismos problemas que mpls resuelve en ipv4</p>',
            problem:
                '<p>Ipv6 resulve muchos problemas de calidad de servicio por defecto. Problemas que ipv4 necesita de otros protocolos para poder enfrentar. </p>',
            state: '<p>Deberia de completar esta <strong>info</strong> </p>',
        },
        methodology: {
            analysis: '<p>Funciona o no funciona\t</p>',
            considerations: '<p>Ninguna consideración</p>',
            design: '<p>Diseño experimental\t\t</p>',
            instruments: '<p>Simulador <strong>GNS3</strong></p>',
            participants: '<p>Amilcar Rey</p>',
            place: '<p>UAP</p>',
            procedures: '<p>Experimentación con distintos escenarios</p>',
            type: 'Investigaciones cuantitativas, cualitativas, mixtas o experimentales',
        },
        publication: {
            plan: '<p>No plan yet</p>',
            result: 'Artículo científico',
        },
        bibliography: {
            chart: [
                {
                    author: 'Ponce',
                    title: 'Las redes y los automatas',
                    year: '1902',
                },
                {
                    author: 'Tanembaum',
                    title: 'Redes y telecomunicaciones',
                    year: '2000',
                },
            ],
        },
    },
}

export default function Page() {
    return <ProtocolForm protocol={protocol} />
}
