import { RadioGroup } from '@headlessui/react'
import { useReviewContext } from '@utils/reviewContext'
import clsx from 'clsx'
import { questions } from 'config/review-questions'
import React from 'react'

export default function ReviewQuestion({
    id,
    index,
}: {
    id: string
    index: number
}) {
    const form = useReviewContext()
    return (
        <div>
            <RadioGroup
                className="mt-2"
                value={
                    form.getInputProps('questions.' + index + '.approved').value
                }
                onChange={(e) => {
                    form.setFieldValue('questions.' + index + '.approved', e)
                    if (e)
                        form.setFieldValue(
                            'questions.' + index + '.comment',
                            ''
                        )
                }}
                defaultValue={
                    form.getInputProps('questions.' + index + '.approved').value
                }
            >
                <RadioGroup.Label className="select-none text-xs">
                    <b>{index + 1}- </b>
                    {questions.find((question) => question.id === id)?.question}
                </RadioGroup.Label>
                <div className="mt-1 grid grid-cols-2 gap-6">
                    <RadioGroup.Option
                        key={`yes-${id}`}
                        value={true}
                        className={({ checked }) =>
                            clsx(
                                checked
                                    ? 'bg-success-50 text-success-600 ring-[1.5px] ring-success-600'
                                    : 'bg-white text-gray-500 ring-1 ring-inset ring-gray-200 hover:bg-gray-100',
                                'flex items-center justify-center rounded-md py-0.5 text-sm font-semibold uppercase '
                            )
                        }
                    >
                        <RadioGroup.Label as="span">SI</RadioGroup.Label>
                    </RadioGroup.Option>
                    <RadioGroup.Option
                        key={`no-${id}`}
                        value={false}
                        className={({ checked }) =>
                            clsx(
                                checked
                                    ? 'bg-error-50 text-error-600 ring-[1.5px] ring-error-600'
                                    : 'bg-white text-gray-500 ring-1 ring-inset ring-gray-200 hover:bg-gray-100',
                                'flex items-center justify-center rounded-md py-0.5 text-sm font-semibold uppercase'
                            )
                        }
                    >
                        <RadioGroup.Label as="span">NO</RadioGroup.Label>
                    </RadioGroup.Option>
                </div>
            </RadioGroup>
            {form.getInputProps('questions.' + index + '.approved')
                .value ? null : (
                <>
                    <label className="label">Recomendación</label>
                    <textarea
                        className="input"
                        {...form.getInputProps(
                            'questions.' + index + '.comment'
                        )}
                    />
                </>
            )}
        </div>
    )
}