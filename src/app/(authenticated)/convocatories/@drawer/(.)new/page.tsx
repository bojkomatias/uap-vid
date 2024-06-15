import { DialogDescription, DialogTitle } from '@components/dialog'
import { ConvocatoryForm } from '@convocatory/convocatory-form'
import { InterceptDialog } from '@shared/intercept-dialog'

export default function Page() {
  return (
    <InterceptDialog
      intercept="/convocatories/new"
      push="/convocatories"
      size="xl"
    >
      <DialogTitle>Crear convocatoria</DialogTitle>
      <DialogDescription>
        Aquí puede crear una nueva convocatoria a cual asignar proyectos de
        investigación
      </DialogDescription>
      <ConvocatoryForm
        convocatory={{
          name: '',
          from: new Date(),
          to: new Date(),
          year: new Date().getFullYear(),
        }}
      />
    </InterceptDialog>
  )
}
