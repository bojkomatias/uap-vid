import { useProtocolContext } from '@utils/createContext'
import { TipTapProps } from '@elements/TipTap'
import dynamic from 'next/dynamic'
const Tiptap = dynamic<TipTapProps>(() =>
    import('@elements/TipTap').then((mod) => mod.default)
)

interface TextareaProps {
    path: string
    label: string
}

const Textarea = ({ path, label }: TextareaProps) => {
    const form = useProtocolContext()

    return (
        <div>
            <label className="label">{label}</label>
            <Tiptap {...form.getInputProps(path)} />
            {form.getInputProps(path).error ? (
                <p className=" pt-1 pl-3 text-xs text-gray-600 saturate-[80%]">
                    *{form.getInputProps(path).error}
                </p>
            ) : null}
        </div>
    )
}

export default Textarea
