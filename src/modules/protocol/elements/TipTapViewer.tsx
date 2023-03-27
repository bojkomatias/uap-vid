'use client'
import TextAlign from '@tiptap/extension-text-align'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import clsx from 'clsx'

interface TipTapViewerProps {
    title: string
    content: string | null
    rounded?: boolean
}
const TipTapViewer = ({
    title,
    content,
    rounded = true,
}: TipTapViewerProps) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        content: content,
        editable: false,
    })

    return (
        <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">{title}</dt>
            <dd
                className={clsx('border px-4 max-w-none prose', {
                    rounded: rounded,
                })}
            >
                <EditorContent editor={editor} />
            </dd>
        </div>
    )
}
export default TipTapViewer