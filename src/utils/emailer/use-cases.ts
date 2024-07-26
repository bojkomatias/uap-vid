export enum useCases {
  onReview = 'onReview',
  onRevised = 'onRevised',
  onAssignation = 'onAssignation',
  onPublish = 'onPublish',
  onApprove = 'onApprove',
  changeUserEmail = 'changeUserEmail',
}

export const useCasesDictionary: { [key: string]: string } = {
  onReview: 'Evaluación de protocolo',
  onRevised: 'Corrección de protocolo',
  onAssignation: 'Asignación de evaluador',
  onPublish: 'Publicación de protocolo',
  onApprove: 'Aprobación de protocolo',
  changeUserEmail: 'Cambio de email',
}
