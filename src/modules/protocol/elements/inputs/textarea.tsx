import { useProtocolContext } from '@utils/createContext'
import dynamic from 'next/dynamic'
const Tiptap = dynamic(() => import('@elements/tiptap'))

const Textarea = ({ path, label }: { path: string; label: string }) => {
    const form = useProtocolContext()

    return (
        <div>
            <label className="label">{label}</label>
            <Tiptap {...form.getInputProps(path)} />
            {form.getInputProps(path).error ? (
                <p className="error">*{form.getInputProps(path).error}</p>
            ) : null}
        </div>
    )
}

export default Textarea
