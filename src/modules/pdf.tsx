'use client'
import type { Protocol } from '@prisma/client'
import {
    Document,
    Page,
    View,
    Text,
    usePDF,
    PDFDownloadLink,
} from '@react-pdf/renderer'
import { Button } from '@elements/button'
import { Download } from 'tabler-icons-react'

const PDFDocument = ({ protocol }: { protocol: Protocol }) => {
    return (
        <>
            <Document>
                <Page
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 12,
                        padding: 30,
                        paddingHorizontal: 42,
                    }}
                >
                    <View
                        id="identificación"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 12,
                        }}
                    >
                        <Text
                            style={{
                                fontWeight: 600,
                                fontSize: 20,
                                textAlign: 'center',
                                marginBottom: 4,
                            }}
                        >
                            {protocol.sections.identification.title}
                        </Text>

                        <View
                            style={{
                                paddingTop: 6,
                                fontWeight: 300,
                                fontSize: 10,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Text style={{ color: 'gray', marginBottom: 4 }}>
                                Asignatura
                            </Text>{' '}
                            <Text style={{ fontWeight: 600 }}>
                                {protocol.sections.identification.assignment}
                            </Text>
                        </View>
                        <View
                            style={{
                                fontWeight: 300,
                                fontSize: 10,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Text style={{ color: 'gray', marginBottom: 4 }}>
                                Carrera
                            </Text>{' '}
                            <Text style={{ fontWeight: 600 }}>
                                {protocol.sections.identification.career}
                            </Text>
                        </View>

                        <View
                            style={{
                                fontWeight: 300,
                                fontSize: 10,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Text style={{ color: 'gray', marginBottom: 4 }}>
                                Ente patrocinante
                            </Text>{' '}
                            <Text style={{ fontWeight: 600 }}>
                                {protocol.sections.identification.sponsor}
                            </Text>
                        </View>
                        <View
                            style={{
                                fontWeight: 300,
                                fontSize: 10,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Text style={{ color: 'gray', marginBottom: 4 }}>
                                Equipo
                            </Text>{' '}
                            <Text style={{ fontWeight: 600 }}>
                                {protocol.sections.identification.team.map(
                                    (teamMember, idx) => {
                                        return (
                                            <Text key={idx}>
                                                <Text
                                                    style={{
                                                        fontWeight: 300,
                                                        marginRight: 4,
                                                    }}
                                                >
                                                    Nombre: {teamMember.name}{' '}
                                                    {teamMember.last_name}
                                                </Text>{' '}
                                                <Text
                                                    style={{ fontWeight: 600 }}
                                                >
                                                    | Rol: {teamMember.role}
                                                </Text>{' '}
                                                <Text
                                                    style={{ fontWeight: 300 }}
                                                >
                                                    {' '}
                                                    | Cantidad de horas:{' '}
                                                    {teamMember.hours}{' '}
                                                </Text>{' '}
                                            </Text>
                                        )
                                    }
                                )}
                            </Text>
                        </View>
                    </View>
                    <View
                        id="duración"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 12,
                            borderTop: 0.2,
                            paddingTop: 6,
                        }}
                    >
                        <Text
                            style={{
                                textAlign: 'center',
                                marginVertical: 10,
                                fontSize: 11,
                                color: '#5A5A5A',
                            }}
                        >
                            Duración
                        </Text>{' '}
                        <View
                            style={{
                                fontWeight: 300,
                                fontSize: 10,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Text style={{ color: 'gray', marginBottom: 4 }}>
                                Duración
                            </Text>{' '}
                            <Text style={{ fontWeight: 600 }}>
                                {protocol.sections.duration.duration}
                            </Text>
                        </View>
                        <View
                            style={{
                                fontWeight: 300,
                                fontSize: 10,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Text style={{ color: 'gray', marginBottom: 4 }}>
                                Modalidad
                            </Text>{' '}
                            <Text style={{ fontWeight: 600 }}>
                                {protocol.sections.duration.modality}
                            </Text>
                        </View>
                        <View
                            style={{
                                fontWeight: 300,
                                fontSize: 10,
                            }}
                        >
                            <Text
                                style={{
                                    color: 'gray',
                                    marginBottom: 4,
                                }}
                            >
                                Cronograma
                            </Text>{' '}
                            <View
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                {protocol.sections.duration.chronogram.map(
                                    (crono, idx) => {
                                        return (
                                            <View
                                                key={idx}
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                }}
                                            >
                                                <Text
                                                    style={{
                                                        color: 'gray',
                                                    }}
                                                >
                                                    {crono.semester}:{' '}
                                                </Text>
                                                <View
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        marginHorizontal: 8,
                                                        marginVertical: 5,
                                                    }}
                                                >
                                                    {crono.data.map(
                                                        (cron, i) => {
                                                            return (
                                                                <Text key={i}>
                                                                    {`${
                                                                        i + 1
                                                                    })`}{' '}
                                                                    {cron.task}{' '}
                                                                </Text>
                                                            )
                                                        }
                                                    )}
                                                </View>
                                            </View>
                                        )
                                    }
                                )}
                            </View>
                        </View>
                    </View>
                    <View
                        id="presupuesto"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 12,
                            borderTop: 0.2,
                            paddingTop: 6,
                        }}
                    >
                        <Text
                            style={{
                                textAlign: 'center',
                                marginVertical: 10,
                                fontSize: 11,
                                color: '#5A5A5A',
                            }}
                        >
                            Presupuesto
                        </Text>
                        <View
                            style={{
                                fontWeight: 300,
                                fontSize: 10,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Text style={{ color: 'gray', marginBottom: 4 }}>
                                Detalles del presupuesto
                            </Text>{' '}
                            <View
                                style={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                }}
                            >
                                {protocol.sections.budget.expenses.map(
                                    (gasto, idx) => {
                                        return (
                                            <>
                                                <Text
                                                    key={idx}
                                                    style={{
                                                        fontWeight: 300,
                                                        color: 'gray',
                                                    }}
                                                >
                                                    Tipo: {gasto.type}
                                                </Text>
                                                <View
                                                    key={idx}
                                                    style={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        marginHorizontal: 8,
                                                        marginVertical: 5,
                                                    }}
                                                >
                                                    {gasto.data.map(
                                                        (gasto, i) => {
                                                            return (
                                                                <Text key={i}>
                                                                    {`${
                                                                        i + 1
                                                                    }) `}
                                                                    {
                                                                        gasto.detail
                                                                    }{' '}
                                                                    | Monto: $
                                                                    {gasto.amount
                                                                        .toString()
                                                                        .replace(
                                                                            /\B(?=(\d{3})+(?!\d))/g,
                                                                            '.'
                                                                        )}{' '}
                                                                    | Año:{' '}
                                                                    {gasto.year}
                                                                </Text>
                                                            )
                                                        }
                                                    )}
                                                </View>
                                            </>
                                        )
                                    }
                                )}
                            </View>
                        </View>
                    </View>
                    <View
                        id="descripción"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 12,
                            borderTop: 0.2,
                            paddingTop: 6,
                        }}
                    >
                        <Text
                            style={{
                                textAlign: 'center',
                                marginVertical: 10,
                                fontSize: 11,
                                color: '#5A5A5A',
                            }}
                        >
                            Descripción
                        </Text>
                        <View
                            style={{
                                fontWeight: 300,
                                fontSize: 10,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Text style={{ color: 'gray', marginBottom: 4 }}>
                                Campo
                            </Text>{' '}
                            <Text style={{ fontWeight: 600 }}>
                                {protocol.sections.description.field}
                            </Text>
                        </View>
                        <View
                            style={{
                                fontWeight: 300,
                                fontSize: 10,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Text style={{ color: 'gray', marginBottom: 4 }}>
                                Campo
                            </Text>{' '}
                            <Text style={{ fontWeight: 600 }}>
                                {protocol.sections.description.discipline}
                            </Text>
                        </View>
                        <View
                            style={{
                                fontWeight: 300,
                                fontSize: 10,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Text style={{ color: 'gray', marginBottom: 4 }}>
                                Línea de investigación
                            </Text>{' '}
                            <Text style={{ fontWeight: 600 }}>
                                {protocol.sections.description.line}
                            </Text>
                        </View>
                        <View
                            style={{
                                fontWeight: 300,
                                fontSize: 10,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Text style={{ color: 'gray', marginBottom: 4 }}>
                                Tipo de investigación
                            </Text>{' '}
                            <Text style={{ fontWeight: 600 }}>
                                {protocol.sections.description.type}
                            </Text>
                        </View>
                        <View
                            style={{
                                fontWeight: 300,
                                fontSize: 10,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Text style={{ color: 'gray', marginBottom: 4 }}>
                                Educación
                            </Text>{' '}
                            <Text style={{ fontWeight: 600 }}>
                                {protocol.sections.description.objective}
                            </Text>
                        </View>
                        <View
                            style={{
                                fontWeight: 300,
                                fontSize: 10,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Text style={{ color: 'gray', marginBottom: 4 }}>
                                Palabras clave
                            </Text>{' '}
                            <Text style={{ fontWeight: 600 }}>
                                {protocol.sections.description.words}
                            </Text>
                        </View>
                        <View
                            style={{
                                fontWeight: 300,
                                fontSize: 10,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Text style={{ color: 'gray', marginBottom: 4 }}>
                                Resumen técnico
                            </Text>{' '}
                            <Text style={{ fontWeight: 600 }}>
                                {protocol.sections.description.technical.replace(
                                    /<\/?[^>]+(>|$)/g,
                                    ' '
                                )}
                            </Text>
                        </View>
                    </View>
                    <View
                        id="introducción"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 12,
                            borderTop: 0.2,
                            paddingTop: 6,
                        }}
                    >
                        <Text
                            style={{
                                textAlign: 'center',
                                marginVertical: 10,
                                fontSize: 11,
                                color: '#5A5A5A',
                            }}
                        >
                            Introducción
                        </Text>
                        <View
                            style={{
                                fontWeight: 300,
                                fontSize: 10,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Text style={{ color: 'gray', marginBottom: 4 }}>
                                Problemática
                            </Text>{' '}
                            <Text style={{ fontWeight: 600 }}>
                                {protocol.sections.introduction.problem.replace(
                                    /<\/?[^>]+(>|$)/g,
                                    ' '
                                )}
                            </Text>
                        </View>
                        <View
                            style={{
                                fontWeight: 300,
                                fontSize: 10,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Text style={{ color: 'gray', marginBottom: 4 }}>
                                Estado
                            </Text>{' '}
                            <Text style={{ fontWeight: 600 }}>
                                {protocol.sections.introduction.state.replace(
                                    /<\/?[^>]+(>|$)/g,
                                    ' '
                                )}
                            </Text>
                        </View>
                        <View
                            style={{
                                fontWeight: 300,
                                fontSize: 10,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Text style={{ color: 'gray', marginBottom: 4 }}>
                                Objetivos
                            </Text>{' '}
                            <Text style={{ fontWeight: 600 }}>
                                {protocol.sections.introduction.objectives.replace(
                                    /<\/?[^>]+(>|$)/g,
                                    ' '
                                )}
                            </Text>
                        </View>
                        <View
                            style={{
                                fontWeight: 300,
                                fontSize: 10,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Text style={{ color: 'gray', marginBottom: 4 }}>
                                Justificación
                            </Text>{' '}
                            <Text style={{ fontWeight: 600 }}>
                                {protocol.sections.introduction.justification.replace(
                                    /<\/?[^>]+(>|$)/g,
                                    ' '
                                )}
                            </Text>
                        </View>
                    </View>
                    <View
                        id="metodología"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 12,
                            borderTop: 0.2,
                            paddingTop: 6,
                        }}
                    >
                        <Text
                            style={{
                                textAlign: 'center',
                                marginVertical: 10,
                                fontSize: 11,
                                color: '#5A5A5A',
                            }}
                        >
                            Metodología
                        </Text>
                        <View
                            style={{
                                fontWeight: 300,
                                fontSize: 10,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Text style={{ color: 'gray', marginBottom: 4 }}>
                                Tipo de metodología
                            </Text>{' '}
                            <Text style={{ fontWeight: 600 }}>
                                {protocol.sections.methodology.type.replace(
                                    /<\/?[^>]+(>|$)/g,
                                    ' '
                                )}
                            </Text>
                        </View>
                    </View>
                    <View
                        id="publicación"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 12,
                            borderTop: 0.2,
                            paddingTop: 6,
                        }}
                    >
                        <Text
                            style={{
                                textAlign: 'center',
                                marginVertical: 10,
                                fontSize: 11,
                                color: '#5A5A5A',
                            }}
                        >
                            Publicación
                        </Text>
                        <View
                            style={{
                                fontWeight: 300,
                                fontSize: 10,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Text style={{ color: 'gray', marginBottom: 4 }}>
                                Resultado de la investigación
                            </Text>{' '}
                            <Text style={{ fontWeight: 600 }}>
                                {protocol.sections.publication.result.replace(
                                    /<\/?[^>]+(>|$)/g,
                                    ' '
                                )}
                            </Text>
                        </View>
                        <View
                            style={{
                                fontWeight: 300,
                                fontSize: 10,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Text style={{ color: 'gray', marginBottom: 4 }}>
                                Título de la publicación
                            </Text>{' '}
                            <Text style={{ fontWeight: 600 }}>
                                {protocol.sections.publication.title.replace(
                                    /<\/?[^>]+(>|$)/g,
                                    ' '
                                )}
                            </Text>
                        </View>
                    </View>
                    <View
                        id="bibliografía"
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 12,
                            borderTop: 0.2,
                            paddingTop: 6,
                        }}
                    >
                        <View
                            style={{
                                fontWeight: 300,
                                fontSize: 10,
                                display: 'flex',
                                flexDirection: 'column',
                            }}
                        >
                            <Text
                                style={{
                                    textAlign: 'center',
                                    marginVertical: 10,
                                    fontSize: 11,
                                    color: '#5A5A5A',
                                }}
                            >
                                Bibliografía
                            </Text>
                            <Text style={{ color: 'gray', marginVertical: 4 }}>
                                Recursos utilizados
                            </Text>{' '}
                            <Text style={{ fontWeight: 600 }}>
                                {protocol.sections.bibliography.chart.map(
                                    (resource, idx) => {
                                        return (
                                            <Text key={idx}>
                                                Título: {resource.title} |
                                                Autor: {resource.author} | Año:{' '}
                                                {resource.year}
                                            </Text>
                                        )
                                    }
                                )}
                            </Text>
                        </View>
                    </View>
                </Page>
            </Document>
        </>
    )
}

export const PDF = ({ protocol }: { protocol: Protocol }) => {
    const [instance] = usePDF({
        document: PDFDocument({ protocol }),
    })

    if (instance.loading)
        return <Button intent="secondary">Cargando PDF</Button>
    else if (instance.error) return <p>Ocurrió un error al cargar el PDF</p>

    return (
        <PDFDownloadLink
            fileName={`proyecto-${protocol.id}`}
            document={PDFDocument({ protocol })}
        >
            <Button intent="secondary">
                <Download className="mr-2 h-5" />
                <span className="text-xs">Descargar PDF</span>
            </Button>
        </PDFDownloadLink>
    )
}
