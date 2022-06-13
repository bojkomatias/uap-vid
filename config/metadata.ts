import { InputType } from './enums'
import { Protocol } from './types'
import { Helpers } from './helpers'
export const ProtocolMetadata: Protocol = {
    data: [
        {
            // 1. Identificacion del Proyecto
            sectionId: 1,
            name: 'identificación',
            description: Helpers[0],
            data: [
                // 1.1 Titulo
                { type: InputType.text, title: 'titulo', value: null },
                {
                    type: InputType.select,
                    title: 'carrera',
                    options: ['Ingenieria en Sistemas'],
                    value: null,
                },
                {
                    type: InputType.select,
                    title: 'materia',
                    options: ['Sistemas Operativos'],
                    value: null,
                },
                {
                    type: InputType.table,
                    title: 'miembros del equipo y horas',
                    options: [
                        {
                            name: 'role',
                            header: 'Rol',
                            options: [
                                'Director',
                                'Coodirector',
                                'Investigador UAP',
                                'Investigador Externo UAP',
                                'Técnico Asistente',
                                'Técnico Asociado',
                                'Técnico Principal',
                                'Profesional Adjunto',
                                'Profesional Principal',
                                'Becario CONICET',
                            ],
                            type: InputType.select,
                        },
                        {
                            name: 'name',
                            header: 'Nombre',
                            type: InputType.text,
                        },
                        {
                            name: 'hours',
                            header: 'Horas',
                            type: InputType.text,
                        },
                    ],
                    value: [{ role: 'Director', name: '', hours: '' }],
                },
                {
                    type: InputType.select,
                    title: 'modalidad del proyecto',
                    options: [
                        'Proyecto regular de investigación (PRI)',
                        'Proyecto de investigación con becados (PIB)',
                        'Proyecto de investigación desde las cátedras (PIC)',
                        'Proyecto de investigación institucional (PII)',
                        'Proyecto de investigación interfacultades (PIIF)',
                        'Proyecto I + D + i (PIDi)',
                        'Proyecto Tesis Posgrado (PTP)',
                    ],
                    value: null,
                },
                {
                    type: InputType.select,
                    title: 'entre patrocinante',

                    options: [
                        'Facultad de Ciencias Economicas y de la Administracion (FACEA)',
                        'Facultad de Ciencias de la Salud (FCS)',
                        'Facultad de Humanidades, Educacion y Ciencias Sociales (FHECIS)',
                        'Facultad de Teología (FT)',
                        'Consejo Nacional de Investigaciones Científicas y Técnicas (CONICET)',
                        'Centro de investigación o departamento',
                        'Escuela de graduados (EG)',
                    ],
                    value: null,
                },
            ],
        },
        {
            sectionId: 2,
            name: 'duración del proyecto',
            data: [
                {
                    type: InputType.select,
                    title: 'escala temporal',
                    options: [
                        '12 meses',
                        '24 meses',
                        '36 meses',
                        '48 meses',
                        '60 meses',
                    ],
                    value: null,
                },
            ],
        },
        {
            sectionId: 3,
            name: 'cronograma de tareas',
            data: [
                {
                    type: InputType.table,
                    title: 'cronograma',
                    options: [
                        {
                            name: 'task',
                            header: 'Tarea',
                            type: InputType.text,
                        },
                        {
                            name: 'date',
                            header: 'Fecha',
                            type: InputType.text,
                        },
                        {
                            name: 'duration',
                            header: 'Duración',
                            type: InputType.text,
                        },
                    ],
                    value: [{ task: '', date: '', duration: '' }],
                },
            ],
        },
        {
            sectionId: 4,
            name: 'presupuesto de gastos directos',
            description: Helpers[0],
            data: [
                {
                    type: InputType.textarea,
                    title: 'gastos directos',
                    value: null,
                },
                {
                    type: InputType.table,
                    title: 'insumos de laboratorio',
                    options: [
                        {
                            name: 'type',
                            header: 'Tipo',
                            type: InputType.text,
                        },
                        {
                            name: 'detail',
                            header: 'Detalle',
                            type: InputType.text,
                        },
                        {
                            name: 'amount',
                            header: 'Monto',
                            type: InputType.text,
                        },
                        {
                            name: 'year',
                            header: 'Año',
                            type: InputType.text,
                        },
                    ],
                    value: [{ type: '', detail: '', amount: '', year: '' }],
                },
            ],
        },

        {
            sectionId: 5,
            name: 'descripción del proyecto',
            data: [
                {
                    type: InputType.select,
                    title: 'Disciplina general y área específica',
                    options: ['Ejemplo anexo A'],
                    value: null,
                },
                {
                    type: InputType.select,
                    title: 'Línea de investigación',
                    options: ['Ejemplo anexo A'],
                    value: null,
                },
                {
                    type: InputType.text,
                    title: 'Palabras clave',
                    value: null,
                },
                {
                    type: InputType.select,
                    title: 'Campo de aplicación',
                    options: [
                        'Ciencias exactas y naturales',
                        'Ingeniería y tecnología',
                        'Ciencias médicas',
                        'Ciencias agrícolas y veterinarias',
                        'Ciencias sociales',
                        'Humanidades y artes',
                    ],
                    value: null,
                },
                {
                    type: InputType.select,
                    title: 'Objetivo socioeconómico',
                    options: [
                        'Exploración y explotación de la tierra',
                        'Medio ambiente',
                        'Exploración y explotación de espacio',
                        'Transporte, telecomunicación y otras infraestructuras',
                        'Energía',
                        'Producción y tecnología industrial',
                        'Salud',
                        'Agricultura',
                        'Educación',
                        'Cultura, recreación, religión y medios de comunicación',
                        'Estructuras, procesos y sistemas políticos y sociales',
                    ],
                    value: null,
                },
                {
                    type: InputType.select,
                    title: 'Tipo de investigación',
                    options: [
                        'Investigación básica',
                        'Investigación aplicada',
                        'Desarrollo experimental',
                    ],
                    value: null,
                },
            ],
        },
        {
            sectionId: 6,
            name: 'introducción del proyecto',
            data: [
                {
                    type: InputType.text,
                    title: 'Estado actual del tema y principales antecedentes en la literatura',
                    value: null,
                },
                {
                    type: InputType.text,
                    title: 'Justificación científica, académico-institucional y social',
                    value: null,
                },
                {
                    type: InputType.text,
                    title: 'Definición del problema',
                    value: null,
                },
                {
                    type: InputType.text,
                    title: 'Objetivos',
                    value: null,
                },
            ],
        },
        {
            sectionId: 7,
            name: 'método',
            data: [
                {
                    type: InputType.select,
                    title: 'Tipo de investigación (dudoso ver word)',
                    options: [
                        'Investigaciones cuantitativas, cualitativas, mixtas o experimentales',
                        'Investigaciones de tipo teóricas',
                    ],
                    value: null,
                },
            ],
        },
        {
            sectionId: 8,
            name: 'publicación cientifica',
            data: [
                {
                    type: InputType.select,
                    title: 'Especificar cuál será el resultado de la investigación',
                    options: [
                        'Artículo científico',
                        'Capítulo de libro',
                        'Libro',
                    ],
                    value: null,
                },
                {
                    type: InputType.text,
                    title: 'Presentar un plan viable para la publicación de la investigación',
                    value: null,
                },
            ],
        },
        {
            sectionId: 9,
            name: 'lista bibliografica preeliminar',
            data: [
                {
                    type: InputType.table,
                    title: 'Cuadro bliblográfico',
                    options: [
                        {
                            name: 'author',
                            header: 'Autor',
                            type: InputType.text,
                        },
                        {
                            name: 'title',
                            header: 'Titulo',
                            type: InputType.text,
                        },
                        {
                            name: 'year',
                            header: 'Año',
                            type: InputType.text,
                        },
                    ],
                    value: [{ author: '', title: '', year: '' }],
                },
            ],
        },
        {
            sectionId: 10,
            name: 'curricullum del director',
            data: [
                {
                    type: InputType.text,
                    title: 'Formación académica (título, institución, fecha)',
                    value: null,
                },
                {
                    type: InputType.text,
                    title: 'Indicadores generales de calidad de la producción científica',
                    value: null,
                },
                {
                    type: InputType.text,
                    title: '(Subcuadro) Publicaciones',
                    value: null,
                },
                {
                    type: InputType.text,
                    title: '(Subcuadro) Participación en proyectos I D i',
                    value: null,
                },
                {
                    type: InputType.text,
                    title: '(Subcuadro) Gestión de la actividad científica',
                    value: null,
                },
                {
                    type: InputType.text,
                    title: '(Subcuadro) Miembro de comités internacionales',
                    value: null,
                },
                {
                    type: InputType.text,
                    title: '(Subcuadro) Miembro de comités editoriales',
                    value: null,
                },
                {
                    type: InputType.text,
                    title: '(Subcuadro) Premios obtenidos',
                    value: null,
                },
                {
                    type: InputType.select,
                    title: 'Posee categoría docente investigador UAP',
                    options: ['SI', 'NO'],
                    value: null,
                },
            ],
        },
    ],
}
