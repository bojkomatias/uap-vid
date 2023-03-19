'use client'
import { useForm } from '@mantine/hooks'
import { ProtocolReviewsComments } from '@prisma/client'
import { usePathname } from 'next/navigation'
import React from 'react'
import { useCallback } from 'react'

export default function ReviewForm() {
    const path = usePathname()
    const protocolId = path?.split('/')[3]
    const form = useForm({ initialValues: { data: '' } })
    const createComment = useCallback(async (comment: string) => {
        const res = await fetch(`/api/reviews/${protocolId}`, {
            method: 'PUT',
            body: JSON.stringify(comment),
        })
        console.log(res)
    }, [])

    return (
        <div>
            <form
                onSubmit={form.onSubmit((values) => {
                    createComment(values.data)
                })}
            >
                <label className="label">{protocolId}</label>
                <input className="input" {...form.getInputProps('data')} />
            </form>
        </div>
    )
}
