import { useProtocolContext } from '@utils/createContext'
import clsx from 'clsx'
import dynamic from 'next/dynamic'
const Tiptap = dynamic(() => import('@elements/tiptap'))

const Textarea = ({ path, label }: { path: string; label: string }) => {
    const form = useProtocolContext()

    return (
        <div>
            <label
                className={clsx('label required', {
                    'after:text-error-500': form.getInputProps(path).error,
                })}
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
