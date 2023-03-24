'use client'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import clsx from 'clsx'
import {
    ArrowBackUp,
    Bold,
    H1,
    H2,
    H3,
    Italic,
    List,
    ListNumbers,
    Separator,
} from 'tabler-icons-react'
const Tiptap = ({
    value,
    onChange,
}: {
    value: string
    onChange: (a: string) => void
}) => {
    const editor = useEditor({
        extensions: [StarterKit],
        editorProps: {
            attributes: {
                class: 'pt-8 input min-h-[10rem] focus:outline-0',
            },
        },
        content: value,
    })

    return (
        <div className="relative prose max-w-none">
            <MenuBar editor={editor} />

            <EditorContent
                value={value}
                onBlur={() => onChange(editor?.getHTML()!)}
                editor={editor}
            />
        </div>
    )
}

const MenuBar = ({ editor }: any) => {
    if (!editor) {
        return null
    }

    return (
        <div className="absolute inset-x-1 rounded-t top-0.5 h-8 border-b z-10">
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={clsx(
                    'hover:bg-gray-100 hover:text-gray-800 rounded-md px-2 py-1 h-fit my-0.5',
                    editor.isActive('bold')
                        ? 'ring-1 ring-gray-300 ring-offset-1 ring-inset hover:ring-offset-0 text-gray-700'
                        : 'text-gray-500'
                )}
            >
                <Bold className="h-5" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={clsx(
                    'hover:bg-gray-100 hover:text-gray-800 rounded-md px-2 py-1 h-fit my-0.5 mr-4',
                    editor.isActive('italic')
                        ? 'ring-1 ring-gray-300 ring-offset-1 ring-inset hover:ring-offset-0 text-gray-700'
                        : 'text-gray-500'
                )}
            >
                <Italic className="h-5" />
            </button>
            <button
                type="button"
                onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={clsx(
                    'hover:bg-gray-100 hover:text-gray-800 rounded-md px-2 py-1 h-fit my-0.5',
                    editor.isActive('heading', { level: 2 })
                        ? 'ring-1 ring-gray-300 ring-offset-1 ring-inset hover:ring-offset-0 text-gray-700'
                        : 'text-gray-500'
                )}
            >
                <H1 className="h-5" />
            </button>
            <button
                type="button"
                onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                className={clsx(
                    'hover:bg-gray-100 hover:text-gray-800 rounded-md px-2 py-1 h-fit my-0.5',
                    editor.isActive('heading', { level: 3 })
                        ? 'ring-1 ring-gray-300 ring-offset-1 ring-inset hover:ring-offset-0 text-gray-700'
                        : 'text-gray-500'
                )}
            >
                <H2 className="h-5" />
            </button>
            <button
                type="button"
                onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 4 }).run()
                }
                className={clsx(
                    'hover:bg-gray-100 hover:text-gray-800 rounded-md px-2 py-1 h-fit my-0.5 mr-4',
                    editor.isActive('heading', { level: 4 })
                        ? 'ring-1 ring-gray-300 ring-offset-1 ring-inset hover:ring-offset-0 text-gray-700'
                        : 'text-gray-500'
                )}
            >
                <H3 className="h-5" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={clsx(
                    'hover:bg-gray-100 hover:text-gray-800 rounded-md px-2 py-1 h-fit my-0.5',
                    editor.isActive('bulletList')
                        ? 'ring-1 ring-gray-300 ring-offset-1 ring-inset hover:ring-offset-0 text-gray-700'
                        : 'text-gray-500'
                )}
            >
                <List className="h-5" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={clsx(
                    'hover:bg-gray-100 hover:text-gray-800 rounded-md px-2 py-1 h-fit my-0.5 mr-4',
                    editor.isActive('orderedList')
                        ? 'ring-1 ring-gray-300 ring-offset-1 ring-inset hover:ring-offset-0 text-gray-700'
                        : 'text-gray-500'
                )}
            >
                <ListNumbers className="h-5" />
            </button>

            <button
                type="button"
                className="hover:bg-gray-100 hover:text-gray-800 text-gray-500 rounded-md px-2 py-1 h-fit my-0.5"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
            >
                <Separator className="h-5" />
            </button>

            <button
                type="button"
                className="hover:bg-gray-100 hover:text-gray-800 text-gray-500 rounded-md px-2 py-1 h-fit my-0.5"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
            >
                <ArrowBackUp className="h-5" />
            </button>
        </div>
    )
}

export default Tiptap
