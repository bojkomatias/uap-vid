/* eslint-disable jsx-a11y/alt-text */
'use client'
import type { Review, User } from '@prisma/client'
import {
    Document,
    Page,
    View,
    Text,
    Image,
    PDFDownloadLink,
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
                            backgroundColor: '#003C71',

                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <Image
                            style={{ width: 2480 }}
                            src={'CertificateHeader.jpg'}
                        />
                    </View>
                    <View
                        style={{
                            padding: 20,
                            paddingHorizontal: 42,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 15,
                        }}
                    >
                        <Text style={{ marginBottom: 18, fontSize: 25 }}>
                            Certificado de Evaluador
                        </Text>

                        <Text style={{ fontSize: 10 }}>
                            Por medio de la presente se deja constancia que
                        </Text>
                        <Text style={{ fontSize: 18 }}>{user.name}</Text>
                        <Text style={{ fontSize: 10 }}>
                            participó como evaluador de proyectos de
                            investigación de la Universidad Adventista del
                            Plata.
                        </Text>
                        <Text style={{ fontSize: 10 }}>
                            A los fines que diere lugar, se extiende la presente
                            CONSTANCIA en Libertador San Martín, Entre Ríos,
                            Argentina, el {new Date().toLocaleDateString()}
                        </Text>
                    </View>
                    <View
                        style={{
                            backgroundColor: '#003C71',
                            marginTop: '40%',
                            display: 'flex',
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}
                    >
                        <Image src={'CertificateFooter.png'} />
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
                <Button intent="outline" className="float-right mt-4">
                    Descargar certificado de evaluación
                </Button>
            </PDFDownloadLink>
        </>
    )
}
