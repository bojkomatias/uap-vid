'use client'
import { BadgeButton } from '@components/badge'
import { Dialog, DialogDescription, DialogTitle } from '@components/dialog'
import { Divider } from '@components/divider'
import { DialogPanel } from '@headlessui/react'
import React, { useState, useEffect, useRef } from 'react'
import { Bug, Clipboard, Copy, Download } from 'tabler-icons-react'
import { FormTextarea } from './form/form-textarea'
import { SubmitButton } from './submit-button'
import { FormActions } from '@components/fieldset'
import { useForm } from '@mantine/form'
import { bug_report } from '@utils/emailer'
import { notifications } from '@elements/notifications'
import { atom, useAtom } from 'jotai'

export const ContextMenuAtom = atom<boolean>(false)

export default function ContextMenu({
  children,
  menu,
  context,
}: {
  children: React.ReactNode
  menu: React.ReactNode
  context?: any
}) {
  const [showMenu, setShowMenu] = useAtom(ContextMenuAtom)
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })
  const menuRef = useRef<HTMLDivElement>(null)

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    const x = e.pageX
    const y = e.pageY
    setMenuPosition({ x, y })
    setShowMenu(true)
  }

  const handleClickOutside = (e: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
      setShowMenu(false)
    }
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside)
    return () => {
      document.removeEventListener('click', handleClickOutside)
    }
  }, [])

  const [open, setOpen] = useState(false)

  const form = useForm({
    initialValues: {
      content: '',
    },
  })

  return (
    <section onContextMenu={handleContextMenu}>
      {children}
      {showMenu && (
        <div
          className="contextMenu flex flex-col gap-1 rounded-lg border border-gray-300/75 bg-gray-200 px-2 py-1 shadow-md dark:border-gray-800 dark:bg-gray-700 dark:text-gray-200 print:hidden"
          ref={menuRef}
          style={{
            position: 'fixed',
            top: `${menuPosition.y}px`,
            left: `${menuPosition.x}px`,
            zIndex: 1000,
          }}
        >
          {menu}

          <BadgeButton
            className="flex grow justify-between shadow-sm"
            onClick={() => {
              window.print()
              setShowMenu(false)
            }}
          >
            Descargar PDF <Download size={18} />
          </BadgeButton>
          <Divider className="my-2" />

          <BadgeButton
            className="flex grow justify-between shadow-sm transition active:opacity-50"
            onClick={() => {
              navigator.clipboard.writeText(window.getSelection()!.toString())
              setShowMenu(false)
            }}
          >
            Copiar <Copy size={18} />
          </BadgeButton>
          <BadgeButton
            className="flex grow justify-between shadow-sm transition active:opacity-50"
            onClick={async () => {
              await navigator.clipboard.readText()
              setShowMenu(false)
            }}
          >
            Pegar <Clipboard size={18} />
          </BadgeButton>
          <Divider className="my-2" />
          <BadgeButton
            className="flex grow justify-between shadow-sm "
            onClick={async () => {
              setOpen(true)
              setShowMenu(false)
            }}
          >
            Reportar un error <Bug size={18} />
          </BadgeButton>
        </div>
      )}
      <Dialog onClose={setOpen} open={open}>
        <DialogTitle className="flex justify-between">
          Reportar un error <Bug />
        </DialogTitle>
        <DialogPanel>
          <DialogDescription>
            Provea una descripción detallada del error que ocurrió. También
            puede incluir sugerencias.
          </DialogDescription>
          <form
            onSubmit={form.onSubmit(async () => {
              const email = await bug_report({
                description: {
                  user_description: form.getValues().content,
                  context: context,
                },
              })
              if (email) {
                notifications.show({
                  title: 'Email enviado',
                  message:
                    'Se notificó a los desarrolladores sobre el problema o la sugerencia',
                  intent: 'success',
                })
                setOpen(false)
              }
            })}
            className="mt-2"
          >
            <FormTextarea
              label="Descripción"
              {...form.getInputProps('content')}
            />
            <FormActions>
              <SubmitButton isLoading={false}>Enviar</SubmitButton>
            </FormActions>
          </form>
        </DialogPanel>
      </Dialog>
    </section>
  )
}
