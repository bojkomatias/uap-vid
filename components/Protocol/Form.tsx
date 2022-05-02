import { PropsWithChildren } from 'react'
import { Input, Section } from '../../config/types'

export const Form = ({ section }: PropsWithChildren<{ section: Section }>) => {
    return (
        <div>
            {section.name}
            {section.content.map((i: Input) => (
                <div key={i.title}>
                    <label htmlFor="">{i.title}</label>
                    <input type={i.type} name="" id="" />
                </div>
            ))}
        </div>
    )
}
