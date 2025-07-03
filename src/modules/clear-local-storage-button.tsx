'use client'

import { Button } from '../components/button'
import {
  Dialog,
  DialogActions,
  DialogDescription,
  DialogTitle,
} from '../components/dialog'
import { Trash } from 'tabler-icons-react'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

export function ClearLocalStorageButton() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()

  // Only show this component on /protocols/new/0
  if (pathname !== '/protocols/new/0') {
    return null
  }

  const handleClearLocalStorage = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear()
      setOpen(false)
      // Mostrar notificación de éxito si está disponible, sino usar alert simple
      if (typeof window !== 'undefined' && window.location) {
        // Recargar la página para reflejar los cambios
        window.location.reload()
      }
    }
  }

  return (
    <>
      <Button color="red" onClick={() => setOpen(true)}>
        <Trash data-slot="icon" /> Borrar datos del protocolo
      </Button>

      <Dialog open={open} onClose={setOpen} size="md">
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogDescription>
          ¿Está seguro que desea borrar todos los datos guardados del protocolo?
          Esta acción no se puede deshacer y se perderán todos los datos
          guardados localmente.
        </DialogDescription>

        <DialogActions>
          <Button color="gray" onClick={() => setOpen(false)}>
            Cancelar
          </Button>
          <Button color="red" onClick={handleClearLocalStorage}>
            <Trash data-slot="icon" />
            Borrar datos
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
