import {
  Alert,
  AlertActions,
  AlertDescription,
  AlertTitle,
} from '@components/alert'
import { Button } from '@components/button'
import { useState } from 'react'

export default function Info({
  children,
  title,
  content,
}: {
  children: React.ReactNode
  title: string
  content: string
}) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <div className="cursor-help" onClick={() => setIsOpen(true)}>
        {children}
      </div>
      <Alert open={isOpen} onClose={setIsOpen}>
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription>{content}</AlertDescription>
        <AlertActions>
          <Button onClick={() => setIsOpen(false)}>Cerrar</Button>
        </AlertActions>
      </Alert>
    </>
  )
}
