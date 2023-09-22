'use client'
import type { Review, User } from '@prisma/client'
import {
    Document,
    Page,
    View,
    Text,
    usePDF,
    PDFDownloadLink,
} from '@react-pdf/renderer'
import { Button } from '@elements/button'

const PDFDocument = ({ reviews, user }: { reviews: Review[]; user: User }) => {
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
                    <View>
                        <Text>{user.name}</Text>
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
    const [instance] = usePDF({
        document: PDFDocument({ reviews, user }),
    })

    if (instance.loading) return <Button intent="outline">Cargando PDF</Button>
    else if (instance.error) return <p>Ocurrió un error al cargar el PDF</p>

    //Check if the user has made reviews. If not, the component will return nothing. If it does, it will show a button where he or her can download the reviewer certificate.
    if (reviews.length == 0) return

    return (
        <PDFDownloadLink
            fileName={`CERTIFICADO-${user.name
                .replaceAll(' ', '_')
                .toLowerCase()}`}
            document={PDFDocument({ reviews, user })}
        >
            <Button intent="outline" className="float-right mr-3 mt-8">
                Descargar certificado de evaluación
            </Button>
        </PDFDownloadLink>
    )
}
