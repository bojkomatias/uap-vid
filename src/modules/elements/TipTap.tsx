'use client'
import TextAlign from '@tiptap/extension-text-align'
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
    AlignLeft,
    AlignRight,
    AlignCenter,
    AlignJustified,
} from 'tabler-icons-react'
const Tiptap = ({
    value,
    editable,
    onChange,
}: {
    value: string
    editable?: boolean
    onChange: () => void
}) => {
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
        ],
        editorProps: {
            attributes: {
                class: 'pt-4 input min-h-[10rem] focus:outline-0',
            },
        },
        content: value,
        editable: editable,
    })

    return (
        <div className="relative prose max-w-none prose-lead:leading-4">
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
        <div className="absolute inset-x-1 rounded-t top-0.5 h-8 border-b z-10 pb-8">
            {/* Mark text */}
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
            {/* Headings */}
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
            {/* List */}
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
            {/* alignments */}
            <button
                onClick={() =>
                    editor.chain().focus().setTextAlign('left').run()
                }
                className={clsx(
                    'hover:bg-gray-100 hover:text-gray-800 rounded-md px-2 py-1 h-fit my-0.5 mr-4',
                    editor.isActive({ textAlign: 'left' })
                        ? 'ring-1 ring-gray-300 ring-offset-1 ring-inset hover:ring-offset-0 text-gray-700'
                        : 'text-gray-500'
                )}
            >
                <AlignLeft className="h-5" />
            </button>
            <button
                onClick={() =>
                    editor.chain().focus().setTextAlign('center').run()
                }
                className={clsx(
                    'hover:bg-gray-100 hover:text-gray-800 rounded-md px-2 py-1 h-fit my-0.5 mr-4',
                    editor.isActive({ textAlign: 'center' })
                        ? 'ring-1 ring-gray-300 ring-offset-1 ring-inset hover:ring-offset-0 text-gray-700'
                        : 'text-gray-500'
                )}
            >
                <AlignCenter className="h-5" />
            </button>
            <button
                onClick={() =>
                    editor.chain().focus().setTextAlign('right').run()
                }
                className={clsx(
                    'hover:bg-gray-100 hover:text-gray-800 rounded-md px-2 py-1 h-fit my-0.5 mr-4',
                    editor.isActive({ textAlign: 'right' })
                        ? 'ring-1 ring-gray-300 ring-offset-1 ring-inset hover:ring-offset-0 text-gray-700'
                        : 'text-gray-500'
                )}
            >
                <AlignRight className="h-5" />
            </button>
            <button
                onClick={() =>
                    editor.chain().focus().setTextAlign('justify').run()
                }
                className={clsx(
                    'hover:bg-gray-100 hover:text-gray-800 rounded-md px-2 py-1 h-fit my-0.5 mr-4',
                    editor.isActive({ textAlign: 'justify' })
                        ? 'ring-1 ring-gray-300 ring-offset-1 ring-inset hover:ring-offset-0 text-gray-700'
                        : 'text-gray-500'
                )}
            >
                <AlignJustified className="h-5" />
            </button>
            {/* divider */}
            <button
                type="button"
                className="hover:bg-gray-100 hover:text-gray-800 text-gray-500 rounded-md px-2 py-1 h-fit my-0.5"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
            >
                <Separator className="h-5" />
            </button>
            {/* undo */}
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
