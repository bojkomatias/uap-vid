'use client'
import TextAlign from '@tiptap/extension-text-align'
import type { Editor } from '@tiptap/react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import clsx from 'clsx'
import CharacterCount from '@tiptap/extension-character-count'

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
    onChange: (a: string) => void
}) => {
    const editor = useEditor({
        extensions: [
            // @ts-ignore
            StarterKit,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            CharacterCount.configure(),
        ],
        editorProps: {
            attributes: {
                class: 'pt-4 input min-h-[10rem] focus:outline-0 bg-white',
            },
        },
        content: value,
        editable: editable,
    })
    if (!editor) return <></>
    return (
        <div className="prose relative max-w-none">
            <MenuBar editor={editor} />
            <EditorContent
                value={value}
                onBlur={() => onChange(editor.getHTML().replace('<p></p>', ''))}
                editor={editor}
            />
            <div className="absolute bottom-1 right-0 px-3 text-black/30">
                {editor.storage.characterCount.words() <= 1 &&
                editor.storage.characterCount.words() !== 0 ? (
                    <>{editor.storage.characterCount.words()} palabra</>
                ) : (
                    <>{editor.storage.characterCount.words()} palabras</>
                )}
            </div>
        </div>
    )
}

const MenuBar = ({ editor }: { editor: Editor }) => {
    if (!editor) {
        return null
    }

    return (
        <div className="absolute inset-x-0 top-0 z-10 flex w-full gap-0.5 overflow-x-auto rounded-t border border-gray-300 bg-gray-100 px-0.5 ">
            {/* Mark text */}
            <button
                type="button"
                onClick={() => {
                    editor.chain().focus().toggleBold().run()
                }}
                disabled={!editor.can().chain().focus().toggleBold().run()}
                className={clsx(
                    'my-px h-fit rounded-md p-1 hover:bg-gray-200 hover:text-gray-800',
                    editor.isActive('bold')
                        ? 'bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:ring-offset-0'
                        : 'text-gray-500'
                )}
            >
                <Bold className="h-4 w-5" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                disabled={!editor.can().chain().focus().toggleItalic().run()}
                className={clsx(
                    'my-px h-fit rounded-md p-1 hover:bg-gray-200 hover:text-gray-800',
                    editor.isActive('italic')
                        ? 'bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:ring-offset-0'
                        : 'text-gray-500'
                )}
            >
                <Italic className="h-4 w-5" />
            </button>
            {/* Headings */}
            <button
                type="button"
                onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={clsx(
                    'my-px h-fit rounded-md p-1 hover:bg-gray-200 hover:text-gray-800',
                    editor.isActive('heading', { level: 2 })
                        ? 'bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:ring-offset-0'
                        : 'text-gray-500'
                )}
            >
                <H1 className="h-4 w-5" />
            </button>
            <button
                type="button"
                onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                className={clsx(
                    'my-px h-fit rounded-md p-1 hover:bg-gray-200 hover:text-gray-800',
                    editor.isActive('heading', { level: 3 })
                        ? 'bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:ring-offset-0'
                        : 'text-gray-500'
                )}
            >
                <H2 className="h-4 w-5" />
            </button>
            <button
                type="button"
                onClick={() =>
                    editor.chain().focus().toggleHeading({ level: 4 }).run()
                }
                className={clsx(
                    'my-px h-fit rounded-md p-1 hover:bg-gray-200 hover:text-gray-800',
                    editor.isActive('heading', { level: 4 })
                        ? 'bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:ring-offset-0'
                        : 'text-gray-500'
                )}
            >
                <H3 className="h-4 w-5" />
            </button>
            {/* List */}
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={clsx(
                    'my-px h-fit rounded-md p-1 hover:bg-gray-200 hover:text-gray-800',
                    editor.isActive('bulletList')
                        ? 'bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:ring-offset-0'
                        : 'text-gray-500'
                )}
            >
                <List className="h-4 w-5" />
            </button>
            <button
                type="button"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={clsx(
                    'my-px h-fit rounded-md p-1 hover:bg-gray-200 hover:text-gray-800',
                    editor.isActive('orderedList')
                        ? 'bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:ring-offset-0'
                        : 'text-gray-500'
                )}
            >
                <ListNumbers className="h-4 w-5" />
            </button>
            {/* alignments */}
            <button
                type="button"
                onClick={() =>
                    editor.chain().focus().setTextAlign('left').run()
                }
                className={clsx(
                    'my-px h-fit rounded-md p-1 hover:bg-gray-200 hover:text-gray-800',
                    editor.isActive({ textAlign: 'left' })
                        ? 'bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:ring-offset-0'
                        : 'text-gray-500'
                )}
            >
                <AlignLeft className="h-4 w-5" />
            </button>
            <button
                type="button"
                onClick={() =>
                    editor.chain().focus().setTextAlign('center').run()
                }
                className={clsx(
                    'my-px h-fit rounded-md p-1 hover:bg-gray-200 hover:text-gray-800',
                    editor.isActive({ textAlign: 'center' })
                        ? 'bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:ring-offset-0'
                        : 'text-gray-500'
                )}
            >
                <AlignCenter className="h-4 w-5" />
            </button>
            <button
                type="button"
                onClick={() =>
                    editor.chain().focus().setTextAlign('right').run()
                }
                className={clsx(
                    'my-px h-fit rounded-md p-1 hover:bg-gray-200 hover:text-gray-800',
                    editor.isActive({ textAlign: 'right' })
                        ? 'bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:ring-offset-0'
                        : 'text-gray-500'
                )}
            >
                <AlignRight className="h-4 w-5" />
            </button>
            <button
                type="button"
                onClick={() =>
                    editor.chain().focus().setTextAlign('justify').run()
                }
                className={clsx(
                    'my-px h-fit rounded-md p-1 hover:bg-gray-200 hover:text-gray-800',
                    editor.isActive({ textAlign: 'justify' })
                        ? 'bg-white text-gray-700 ring-1 ring-inset ring-gray-300 hover:ring-offset-0'
                        : 'text-gray-500'
                )}
            >
                <AlignJustified className="h-4 w-5" />
            </button>
            {/* divider */}
            <button
                type="button"
                className="my-px h-fit rounded-md p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-800"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
            >
                <Separator className="h-4 w-5" />
            </button>
            {/* undo */}
            <button
                type="button"
                className="my-px h-fit rounded-md p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-800"
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().chain().focus().undo().run()}
            >
                <ArrowBackUp className="h-4 w-5" />
            </button>
        </div>
    )
}

export default Tiptap
