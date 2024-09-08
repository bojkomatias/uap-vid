import { Action } from '@prisma/client'

export const ActionDictionary = {
  [Action.CREATE]: 'Crear proyecto',
  [Action.EDIT]: 'Editar',
  [Action.EDIT_BY_OWNER]: 'Editar',
  [Action.PUBLISH]: 'Publicar',
  [Action.ACCEPT]: 'Aceptar',
  [Action.GENERATE_ANUAL_BUDGET]: 'Generar presupuesto',
  [Action.VIEW_ANUAL_BUDGET]: 'Ver presupuestos',
  [Action.APPROVE]: 'Poner en curso',
  [Action.DELETE]: 'Eliminar',
  [Action.DISCONTINUE]: 'Discontinuar',
  [Action.FINISH]: 'Finalizar',
  [Action.ASSIGN_TO_SCIENTIFIC]: 'Asignar a evaluador',
  [Action.ASSIGN_TO_METHODOLOGIST]: 'Asignar a metodologo',
  [Action.REVIEW]: 'Realizar revision',
  [Action.REACTIVATE]: 'Reactivar',
}
