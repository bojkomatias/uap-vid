'use client'

import TextAlign from '@tiptap/extension-text-align'
import type { Editor } from '@tiptap/react'
import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { cx } from '@utils/cx'
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
  value?: string
  editable?: boolean
  onChange: (a: string) => void
}) => {
  const editor = useEditor({
    injectCSS: false,
    extensions: [
      // @ts-ignore
      StarterKit.configure({
        bold: {
          HTMLAttributes: {
            class: 'dark:text-gray-200',
          },
        },
        heading: {
          HTMLAttributes: {
            class: 'dark:text-gray-200',
          },
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      CharacterCount.configure(),
    ],
    editorProps: {
      attributes: {
        class:
          'pt-8 input min-h-[10rem] focus:outline-0 bg-white dark:bg-gray-800 dark:border-gray-700 dark:!text-gray-200',
      },
    },
    content: value,
    editable: editable,
  })
  if (!editor) return <></>
  return (
    <div className="prose relative max-w-none ">
      <MenuBar editor={editor} />
      <EditorContent
        value={value}
        onBlur={() => onChange(editor.getHTML().replace('<p></p>', ''))}
        editor={editor}
      />
      <div className="absolute bottom-1 right-0 px-3 text-xs text-black/30 ">
        {(
          editor.storage.characterCount.words() <= 1 &&
          editor.storage.characterCount.words() !== 0
        ) ?
          <>{editor.storage.characterCount.words()} palabra</>
        : <>{editor.storage.characterCount.words()} palabras</>}
      </div>
    </div>
  )
}

const MenuBar = ({ editor }: { editor: Editor }) => {
  if (!editor) {
    return null
  }

  const editor_option_styles =
    'my-px h-fit rounded-md p-1 hover:bg-gray-200 hover:text-gray-800 dark:hover:bg-gray-700'

  const editor_option_active_styles =
    'bg-gray-300 text-gray-700 ring-inset hover:ring-offset-0 dark:bg-gray-600 dark:text-gray-200'

  const editor_option_inactive_styles =
    'text-gray-500 dark:text-gray-200 bg-white dark:bg-gray-800'

  return (
    <div className="absolute inset-x-0 top-0 z-10 flex w-full gap-0.5 overflow-x-auto rounded-t border bg-gray-100 px-0.5 dark:border-gray-700 dark:bg-gray-800 ">
      {/* Mark text */}
      <button
        type="button"
        onClick={() => {
          editor.chain().focus().toggleBold().run()
        }}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={cx(
          editor_option_styles,
          editor.isActive('bold') ?
            editor_option_active_styles
          : editor_option_inactive_styles
        )}
      >
        <Bold className="h-4 w-5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={cx(
          editor_option_styles,
          editor.isActive('italic') ?
            editor_option_active_styles
          : editor_option_inactive_styles
        )}
      >
        <Italic className="h-4 w-5" />
      </button>
      {/* Headings */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={cx(
          editor_option_styles,
          editor.isActive('heading', { level: 2 }) ?
            editor_option_active_styles
          : editor_option_inactive_styles
        )}
      >
        <H1 className="h-4 w-5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        className={cx(
          editor_option_styles,
          editor.isActive('heading', { level: 3 }) ?
            editor_option_active_styles
          : editor_option_inactive_styles
        )}
      >
        <H2 className="h-4 w-5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
        className={cx(
          editor_option_styles,
          editor.isActive('heading', { level: 4 }) ?
            editor_option_active_styles
          : editor_option_inactive_styles
        )}
      >
        <H3 className="h-4 w-5" />
      </button>
      {/* List */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={cx(
          editor_option_styles,
          editor.isActive('bulletList') ?
            editor_option_active_styles
          : editor_option_inactive_styles
        )}
      >
        <List className="h-4 w-5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={cx(
          editor_option_styles,
          editor.isActive('orderedList') ?
            editor_option_active_styles
          : editor_option_inactive_styles
        )}
      >
        <ListNumbers className="h-4 w-5" />
      </button>
      {/* alignments */}
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={cx(
          editor_option_styles,
          editor.isActive({ textAlign: 'left' }) ?
            editor_option_active_styles
          : editor_option_inactive_styles
        )}
      >
        <AlignLeft className="h-4 w-5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={cx(
          editor_option_styles,
          editor.isActive({ textAlign: 'center' }) ?
            editor_option_active_styles
          : editor_option_inactive_styles
        )}
      >
        <AlignCenter className="h-4 w-5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={cx(
          editor_option_styles,
          editor.isActive({ textAlign: 'right' }) ?
            editor_option_active_styles
          : editor_option_inactive_styles
        )}
      >
        <AlignRight className="h-4 w-5" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        className={cx(
          editor_option_styles,
          editor.isActive({ textAlign: 'justify' }) ?
            editor_option_active_styles
          : editor_option_inactive_styles
        )}
      >
        <AlignJustified className="h-4 w-5" />
      </button>
      {/* divider */}
      <button
        type="button"
        className="my-px h-fit rounded-md p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-800 dark:hover:bg-gray-600 dark:hover:text-gray-200"
        onClick={() => editor.chain().focus().setHorizontalRule().run()}
      >
        <Separator className="h-4 w-5" />
      </button>
      {/* undo */}
      <button
        type="button"
        className="my-px h-fit rounded-md p-1 text-gray-500 hover:bg-gray-200 hover:text-gray-800 dark:hover:bg-gray-600 dark:hover:text-gray-200"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
      >
        <ArrowBackUp className="h-4 w-5" />
      </button>
    </div>
  )
}

export default Tiptap
