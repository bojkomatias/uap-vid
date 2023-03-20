'use client'
import { Button } from '@elements/Button'
import { useForm } from '@mantine/hooks'
import { ProtocolReviewsComments } from '@prisma/client'
import { usePathname } from 'next/navigation'
import React from 'react'
import { useCallback } from 'react'
import { zodResolver } from '@mantine/form'
import { CommentSchema } from '@utils/zod'

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
        <div className="mb-4">
            <form
                onSubmit={form.onSubmit((values) => {
                    createComment(values.data)
                })}
            >
                <label className="label">{protocolId}</label>
                <textarea
                    rows={5}
                    className="input text-sm transition-all duration-150"
                    {...form.getInputProps('data')}
                />
                <Button
                    type="submit"
                    className="my-2 ml-auto"
                    intent="terciary"
                >
                    Comentar
                </Button>
            </form>
        </div>
    )
}
