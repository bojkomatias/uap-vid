'use client'
import TextAlign from '@tiptap/extension-text-align'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

interface TipTapViewerProps {
    title: string
    content: string
}
const TipTapViewer = ({ title, content }: TipTapViewerProps) => {
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
            <dd className="border p-6 rounded max-w-none prose">
                <EditorContent editor={editor} />
            </dd>
        </div>
    )
}
export default TipTapViewer
