/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import { Button } from '@elements/button'
import type { AnualBudgetItem, AnualBudgetTeamMember } from '@prisma/client'
import {
    Document,
    Page,
    View,
    Text,
    PDFDownloadLink,
} from '@react-pdf/renderer'

import type { AnualBudgetTeamMemberWithAllRelations } from '@utils/anual-budget'
import { currencyFormatter } from '@utils/formatters'

const PDFDocument = ({
    budgetItems,
    budgetTeamMembers,
    year,
    protocolTitle,
    calculations,
}: {
    budgetItems: AnualBudgetItem[]
    budgetTeamMembers: AnualBudgetTeamMemberWithAllRelations[]
    year: number
    protocolTitle: string
    calculations: {
        ABIe: number
        ABTe: number
        ABIr: number
        ABTr: number
        total: number
    }
}) => {
    return (
        <>
            <Document>
                <Page style={{ fontSize: 11, padding: 40 }}>
                    {' '}
                    <Text
                        style={{
                            fontSize: 20,
                            paddingBottom: 4,
                        }}
                    >
                        Presupuesto anual {year}
                    </Text>
                    <Text
                        style={{
                            fontSize: 15,
                            borderBottom: 2,
                            paddingBottom: 6,
                        }}
                    >
                        {protocolTitle}
                    </Text>
                    <View
                        style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                            gap: 25,
                            alignItems: 'flex-end',
                        }}
                    >
                        <View>
                            {' '}
                            <Text style={{ marginVertical: 10, fontSize: 13 }}>
                                Honorarios
                            </Text>
                            <View>
                                <View
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'row',
                                        justifyContent: 'space-between',
                                        borderBottom: 1,
                                    }}
                                >
                                    <Text style={{ width: '40%' }}>
                                        Miembro
                                    </Text>
                                    <Text style={{ width: '22%' }}>Horas</Text>
                                    <Text style={{ width: '22%' }}>
                                        Valor hora
                                    </Text>
                                    <Text
                                        style={{
                                            width: '16%',
                                            textAlign: 'right',
                                        }}
                                    >
                                        Total
                                    </Text>
                                </View>
                                <View>
                                    <View
                                        style={{
                                            display: 'flex',
                                            flexDirection: 'column',
                                            marginTop: 3,
                                            gap: 3,
                                        }}
                                    >
                                        {budgetTeamMembers.map(
                                            (member, idx) => {
                                                return (
                                                    <View
                                                        key={idx}
                                                        style={{
                                                            display: 'flex',
                                                            flexDirection:
                                                                'row',
                                                        }}
                                                    >
                                                        <Text
                                                            style={{
                                                                width: '40%',
                                                            }}
                                                        >
                                                            {
                                                                member
                                                                    .teamMember
                                                                    .name
                                                            }
                                                        </Text>
                                                        <Text
                                                            style={{
                                                                width: '22%',
                                                            }}
                                                        >
                                                            {member.hours}
                                                        </Text>
                                                        <Text
                                                            style={{
                                                                width: '22%',
                                                            }}
                                                        >
                                                            $
                                                            {currencyFormatter.format(
                                                                member.teamMember.categories
                                                                    .at(-1)
                                                                    ?.category.price.at(
                                                                        -1
                                                                    )?.price ??
                                                                    0
                                                            )}
                                                        </Text>
                                                        <Text
                                                            style={{
                                                                width: '16%',
                                                                textAlign:
                                                                    'right',
                                                            }}
                                                        >
                                                            $
                                                            {currencyFormatter.format(
                                                                (member.teamMember.categories
                                                                    .at(-1)
                                                                    ?.category.price.at(
                                                                        -1
                                                                    )?.price ??
                                                                    0) *
                                                                    member.hours
                                                            )}
                                                        </Text>
                                                    </View>
                                                )
                                            }
                                        )}
                                    </View>
                                </View>
                            </View>
                            {budgetItems.length > 0 && (
                                <>
                                    <Text
                                        style={{
                                            marginVertical: 10,
                                            fontSize: 13,
                                        }}
                                    >
                                        Gastos directos
                                    </Text>
                                    <View>
                                        <View
                                            style={{
                                                display: 'flex',
                                                flexDirection: 'row',
                                                justifyContent: 'space-between',
                                                borderBottom: 1,
                                            }}
                                        >
                                            <Text style={{ width: '80%' }}>
                                                Detalle
                                            </Text>

                                            <Text
                                                style={{
                                                    width: '20%',
                                                    textAlign: 'right',
                                                }}
                                            >
                                                Total
                                            </Text>
                                        </View>
                                        <View>
                                            <View
                                                style={{
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    marginTop: 3,
                                                    gap: 3,
                                                }}
                                            >
                                                {budgetItems.map(
                                                    (item, idx) => {
                                                        return (
                                                            <View
                                                                key={idx}
                                                                style={{
                                                                    display:
                                                                        'flex',
                                                                    flexDirection:
                                                                        'row',
                                                                }}
                                                            >
                                                                <Text
                                                                    style={{
                                                                        width: '80%',
                                                                    }}
                                                                >
                                                                    {
                                                                        item.detail
                                                                    }
                                                                </Text>
                                                                <Text
                                                                    style={{
                                                                        width: '20%',
                                                                        textAlign:
                                                                            'right',
                                                                    }}
                                                                >
                                                                    $
                                                                    {currencyFormatter.format(
                                                                        item.amount
                                                                    )}
                                                                </Text>
                                                            </View>
                                                        )
                                                    }
                                                )}
                                            </View>
                                        </View>
                                    </View>
                                </>
                            )}
                        </View>
                        <View>
                            <Text
                                style={{
                                    fontSize: 13,
                                    marginLeft: 'auto',
                                }}
                            >
                                Total
                            </Text>
                            <Text style={{ fontSize: 13 }}>
                                {' '}
                                ARS $
                                {currencyFormatter.format(calculations.total)}
                            </Text>
                        </View>
                    </View>
                </Page>
            </Document>
        </>
    )
}

export const PDF = ({
    budgetItems,
    budgetTeamMembers,
    year,
    protocolTitle,
    calculations,
}: {
    budgetItems: AnualBudgetItem[]
    budgetTeamMembers: AnualBudgetTeamMember[]
    year: number
    protocolTitle: string
    calculations: {
        ABIe: number
        ABTe: number
        ABIr: number
        ABTr: number
        total: number
    }
}) => {
    return (
        <PDFDownloadLink
            fileName={`presupuesto_anual_-${year}_${protocolTitle.replaceAll(
                ' ',
                ''
            )}.pdf`}
            document={
                <PDFDocument
                    budgetItems={budgetItems}
                    budgetTeamMembers={budgetTeamMembers as any}
                    year={year}
                    protocolTitle={protocolTitle}
                    calculations={calculations}
                />
            }
        >
            <Button intent="outline" className="float-right mr-3">
                Descargar PDF
            </Button>
        </PDFDownloadLink>
    )
}
