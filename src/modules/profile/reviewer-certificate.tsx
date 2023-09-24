/* eslint-disable jsx-a11y/alt-text */
'use client'
import type { Review, User } from '@prisma/client'
import {
    Document,
    Page,
    View,
    Text,
    Image,
    usePDF,
    PDFDownloadLink,
    PDFViewer,
} from '@react-pdf/renderer'
import { Button } from '@elements/button'

const PDFDocument = ({ user }: { user: User }) => {
    return (
        <>
            <Document>
                <Page
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 12,
                    }}
                >
                    <View
                        style={{
                            padding: 20,
                            backgroundColor: '#003C71',
                            paddingHorizontal: 42,
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <Image
                            style={{ width: 150 }}
                            src={'/UAP-logo-home.png'}
                        />
                        <Text
                            style={{
                                color: 'white',
                                fontSize: 8,
                            }}
                        >
                            Vicerrectoría de Investigación y Desarrollo
                        </Text>
                    </View>
                    <View
                        style={{
                            padding: 20,
                            paddingHorizontal: 42,
                        }}
                    >
                        <Text style={{ marginBottom: 10 }}>
                            Certificado de Evaluador
                        </Text>
                        <Text style={{ fontSize: 10 }}>
                            Se certifica que {user.name} ha realizado la labor
                            de evaluar proyectos de investigación para la
                            Universidad Adventista del Plata
                        </Text>
                    </View>
                </Page>
            </Document>
        </>
    )
}

export const ReviewerCertificatePDF = ({
    reviews,
    user,
}: {
    reviews: Review[]
    user: User
}) => {
    //Since this is a very small PDF, I removed the logic to wait until it was ready to download.

    //Check if the user has made reviews. If not, the component will return nothing. If it does, it will show a button where he or her can download the reviewer certificate.
    if (reviews.length == 0) return

    return (
        <>
            <PDFDownloadLink
                fileName={`CERTIFICADO-${user.name
                    .replaceAll(' ', '_')
                    .toLowerCase()}`}
                document={PDFDocument({ user })}
            >
                <Button intent="outline" className="float-right mr-3 mt-8">
                    Descargar certificado de evaluación
                </Button>
            </PDFDownloadLink>
        </>
    )
}
