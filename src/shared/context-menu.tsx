'use client'
import { BadgeButton } from '@components/badge'
import { Divider } from '@components/divider'
import React, { useState, useEffect, useRef } from 'react'
import { Clipboard, Copy, Download, File } from 'tabler-icons-react'

export default function ContextMenu({
  children,
  menu,
}: {
  children: React.ReactNode
  menu: React.ReactNode
}) {
  const [showMenu, setShowMenu] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })
  const menuRef = useRef<HTMLDivElement>(null)

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()
    const x = e.pageX
    const y = e.pageY
    setMenuPosition({ x, y })
    setShowMenu(true)
    console.log('right click')
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
            }}
          >
            Descargar PDF <Download size={18} />
          </BadgeButton>
          <Divider className="my-2" />

          <BadgeButton
            className="flex grow justify-between shadow-sm active:opacity-50"
            onClick={() => {
              navigator.clipboard.writeText(window.getSelection()!.toString())
            }}
          >
            Copiar <Copy size={18} />
          </BadgeButton>
          <BadgeButton
            className="flex grow justify-between shadow-sm "
            onClick={async () => {
              const text = await navigator.clipboard.readText()
              console.log(text)
            }}
          >
            Pegar <Clipboard size={18} />
          </BadgeButton>
        </div>
      )}
    </section>
  )
}
