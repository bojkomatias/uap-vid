import RichTextEditor from '@elements/RTE'
import { useProtocolContext } from '@utils/createContext'

const Textarea = ({ path, label }: { path: string; label: string }) => {
    const form = useProtocolContext()

    return (
        <div>
            <label className="label">{label}</label>
            <RichTextEditor
                {...form.getInputProps(path)}
                className="input h-auto min-h-[10rem] pt-0 border-gray-200"
                placeholder=""
                sticky={false}
                radius={0}
                controls={[
                    ['bold', 'italic', 'underline'],
                    ['h1', 'h2', 'h3'],
                    ['alignLeft', 'alignCenter', 'alignRight'],
                    ['link'],
                ]}
            />
            {form.getInputProps(path).error ? (
                <p className=" pt-1 pl-3 text-xs text-gray-600 saturate-[80%]">
                    *{form.getInputProps(path).error}
                </p>
            ) : null}
        </div>
    )
}

export default Textarea
