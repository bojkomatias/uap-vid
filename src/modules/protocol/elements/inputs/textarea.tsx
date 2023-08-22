import { useProtocolContext } from '@utils/createContext'
import { cx } from '@utils/cx'
import dynamic from 'next/dynamic'
const Tiptap = dynamic(() => import('@elements/tiptap'))

const Textarea = ({ path, label }: { path: string; label: string }) => {
    const form = useProtocolContext()

    return (
        <div>
            <label
                className={cx(
                    'label required',
                    form.getInputProps(path).error && 'after:text-error-500'
                )}
            >
                {label}
            </label>
            <Tiptap {...form.getInputProps(path)} />
            {form.getInputProps(path).error ? (
                <p className="error">*{form.getInputProps(path).error}</p>
            ) : null}
        </div>
    )
}

export default Textarea
