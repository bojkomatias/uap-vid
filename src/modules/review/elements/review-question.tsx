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
                    {questions.find((question) => question.id === id)?.question}
                </RadioGroup.Label>
                <div className="grid grid-cols-2 gap-6">
                    <RadioGroup.Option
                        key={`yes-${id}`}
                        value={true}
                        className={({ active, checked }) =>
                            clsx(
                                active
                                    ? 'ring-2 ring-primary/50 ring-offset-2'
                                    : '',
                                checked
                                    ? 'bg-primary text-white hover:bg-primary/90'
                                    : 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
                                'flex items-center justify-center rounded-md py-1.5 text-sm font-semibold uppercase'
                            )
                        }
                    >
                        <RadioGroup.Label as="span">SI</RadioGroup.Label>
                    </RadioGroup.Option>
                    <RadioGroup.Option
                        key={`no-${id}`}
                        value={false}
                        className={({ active, checked }) =>
                            clsx(
                                active
                                    ? 'ring-2 ring-gray-700/50 ring-offset-2'
                                    : '',
                                checked
                                    ? 'bg-gray-800 text-white hover:bg-gray-700'
                                    : 'bg-white text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50',
                                'flex items-center justify-center rounded-md py-1.5 text-sm font-semibold uppercase'
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
