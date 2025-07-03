'use client'
import { useProtocolContext } from '@utils/createContext'
import React, { Fragment, useState } from 'react'
import { Plus, Trash, Edit, UserMinus, UserPlus } from 'tabler-icons-react'
import {
  getAllTeamMembers,
  deactivateTeamMember,
  reactivateTeamMember,
} from '@repositories/team-member'
import {
  Description,
  Field,
  Fieldset,
  Label,
  Legend,
} from '@components/fieldset'
import { Button } from '@components/button'
import {
  Dialog,
  DialogActions,
  DialogDescription,
  DialogTitle,
} from '@components/dialog'
import { FormListbox } from '@shared/form/form-listbox'
import { FormInput } from '@shared/form/form-input'
import { FormCombobox } from '@shared/form/form-combobox'
import { Text } from '@components/text'
import Info from '@shared/info'

import { useQuery } from '@tanstack/react-query'
import { getCategoriesForForm } from '@repositories/team-member-category'
import { FormSwitch } from '@shared/form/form-switch'
import { notifications } from '@elements/notifications'

export default function TeamMemberListForm() {
  const form = useProtocolContext()
  const [manualInputMode, setManualInputMode] = useState<{
    [key: number]: boolean
  }>({})
  const [deactivateDialog, setDeactivateDialog] = useState<{
    open: boolean
    teamMemberIndex: number | null
    memberName: string
  }>({
    open: false,
    teamMemberIndex: null,
    memberName: '',
  })

  const [reactivateDialog, setReactivateDialog] = useState<{
    open: boolean
    teamMemberIndex: number | null
    memberName: string
  }>({
    open: false,
    teamMemberIndex: null,
    memberName: '',
  })

  const { data: teamMembers } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: async () => await getAllTeamMembers(),
  })

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => await getCategoriesForForm(),
  })

  const roles_categories = [
    'Técnico Asistente',
    'Técnico Asociado',
    'Técnico Principal',
    'Profesional Adjunto',
    'Profesional Principal',
  ]

  const roles_categories_ids = roles_categories.map((r_c) => {
    const category = categories?.find((c) => c.name == r_c)
    return { value: category?.id, label: category?.name }
  }) as { value: string; label: string }[]

  // Helper function to check if a team member is deactivated
  const isTeamMemberDeactivated = (index: number) => {
    const teamMember = form.getValues().sections.identification.team[index]
    return !!(
      teamMember?.assignments &&
      teamMember.assignments.length > 0 &&
      teamMember.assignments[0]?.to
    )
  }

  const toggleManualInput = (index: number) => {
    setManualInputMode((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const showDeactivateDialog = (index: number) => {
    const teamMember = form.getValues().sections.identification.team[index]
    const memberName = teamMember.name || 'Miembro sin nombre'

    setDeactivateDialog({
      open: true,
      teamMemberIndex: index,
      memberName,
    })
  }

  const showReactivateDialog = (index: number) => {
    const teamMember = form.getValues().sections.identification.team[index]
    const memberName = teamMember.name || 'Miembro sin nombre'

    setReactivateDialog({
      open: true,
      teamMemberIndex: index,
      memberName,
    })
  }

  const handleDeactivateTeamMember = async () => {
    const { teamMemberIndex } = deactivateDialog

    if (teamMemberIndex === null) return

    const protocolId = form.values.id

    if (!protocolId) {
      notifications.show({
        title: 'Error',
        message: 'No se puede desactivar el miembro: protocolo no guardado',
        intent: 'error',
      })
      return
    }

    try {
      const result = await deactivateTeamMember(protocolId, teamMemberIndex)

      if (result.status) {
        notifications.show(result.notification)

        // Update the local form state to reflect the deactivation immediately
        const currentTeam = form.getValues().sections.identification.team
        const updatedTeam = currentTeam.map((member, index) => {
          if (index === teamMemberIndex) {
            // There should only be one assignment per team member
            // Find the active assignment (without a 'to' date) and deactivate it
            const activeAssignmentIndex = member.assignments?.findIndex(
              (a) => !a.to
            )
            if (
              activeAssignmentIndex !== undefined &&
              activeAssignmentIndex !== -1
            ) {
              const updatedAssignments = [...(member.assignments || [])]
              updatedAssignments[activeAssignmentIndex] = {
                ...updatedAssignments[activeAssignmentIndex],
                to: new Date(),
              }
              return {
                ...member,
                assignments: updatedAssignments,
              }
            }
          }
          return member
        })

        // Update the form state
        form.setFieldValue('sections.identification.team', updatedTeam)
      } else {
        notifications.show(result.notification)
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Ocurrió un error al eliminar el miembro del equipo',
        intent: 'error',
      })
    } finally {
      setDeactivateDialog({
        open: false,
        teamMemberIndex: null,
        memberName: '',
      })
    }
  }

  const handleReactivateTeamMember = async () => {
    const { teamMemberIndex } = reactivateDialog

    if (teamMemberIndex === null) return

    const protocolId = form.values.id

    if (!protocolId) {
      notifications.show({
        title: 'Error',
        message: 'No se puede reactivar el miembro: protocolo no guardado',
        intent: 'error',
      })
      return
    }

    try {
      const result = await reactivateTeamMember(protocolId, teamMemberIndex)

      if (result.status) {
        notifications.show(result.notification)

        // Update the local form state to reflect the reactivation immediately
        const currentTeam = form.getValues().sections.identification.team
        const updatedTeam = currentTeam.map((member, index) => {
          if (index === teamMemberIndex) {
            // Find the deactivated assignment (with a 'to' date) and reactivate it
            const deactivatedAssignmentIndex = member.assignments?.findIndex(
              (a) => a.to
            )
            if (
              deactivatedAssignmentIndex !== undefined &&
              deactivatedAssignmentIndex !== -1
            ) {
              const updatedAssignments = [...(member.assignments || [])]
              updatedAssignments[deactivatedAssignmentIndex] = {
                ...updatedAssignments[deactivatedAssignmentIndex],
                to: null,
              }
              return {
                ...member,
                assignments: updatedAssignments,
              }
            }
          }
          return member
        })

        // Update the form state
        form.setFieldValue('sections.identification.team', updatedTeam)
      } else {
        notifications.show(result.notification)
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Ocurrió un error al reactivar el miembro del equipo',
        intent: 'error',
      })
    } finally {
      setReactivateDialog({
        open: false,
        teamMemberIndex: null,
        memberName: '',
      })
    }
  }

  return (
    <Fieldset>
      <Legend>Miembros de Equipo</Legend>
      <Text>
        Liste los miembros de equipo con la cantidad de horas semanales o meses
        totales a trabajar en su defecto
      </Text>
      <div className="mt-2 grid grid-cols-[repeat(21,minmax(0,1fr))] gap-1">
        <Field className="col-span-4">
          <Info content="Puede especificar que va a haber una persona con un rol específico trabajando en el proyecto de investigación. Si el presupuesto es aprobado, debe confirmar el nombre de esta persona antes de comenzar con el proyecto de investigación.">
            <Label>A definir</Label>
            <Description>Miembro de equipo a definir</Description>
          </Info>
        </Field>
        <Field className="col-span-3">
          <Label>Rol</Label>
          <Description>Rol del miembro</Description>
        </Field>
        <Field className="col-span-8">
          <Label>Miembro</Label>
          <Description>
            Seleccione miembro de equipo existente (si no existe, puede añadirlo
            manualmente)
          </Description>
        </Field>
        <Field className="col-span-2">
          <Label>Horas</Label>
          <Description>En una semana</Description>
        </Field>
        <Field className="col-span-2">
          <Label>Meses</Label>
          <Description>En un año</Description>
        </Field>
        <span />
        {form
          .getValues()
          .sections.identification.team.map((_: any, index: number) => {
            const isDeactivated = isTeamMemberDeactivated(index)
            const rowClasses =
              isDeactivated ?
                'opacity-50 line-through decoration-red-500 decoration-2 pointer-events-none relative'
              : ''

            return (
              <Fragment key={index}>
                <div
                  className={`col-span-4 flex items-center justify-center ${rowClasses}`}
                >
                  <FormSwitch
                    checked={
                      form.getInputProps(
                        `sections.identification.team.${index}.toBeConfirmed`
                      ).value
                    }
                    disabled={index == 0 || isDeactivated}
                    title={
                      index == 0 ?
                        "El primer miembro de equipo no puede quedar 'a definir'"
                      : isDeactivated ?
                        'Este miembro ha sido desactivado'
                      : undefined
                    }
                    label=""
                    {...form.getInputProps(
                      `sections.identification.team.${index}.toBeConfirmed`
                    )}
                  />
                </div>

                {(
                  form.getInputProps(
                    `sections.identification.team.${index}.toBeConfirmed`
                  ).value
                ) ?
                  <FormListbox
                    className={`col-span-4 ${rowClasses}`}
                    label=""
                    placeholder={
                      form.getInputProps(
                        `sections.identification.team.${index}.toBeConfirmed`
                      ).value && 'Seleccione una categoría'
                    }
                    options={roles_categories_ids}
                    disabled={isDeactivated}
                    {...form.getInputProps(
                      `sections.identification.team.${index}.categoryToBeConfirmed`
                    )}
                  />
                : <FormListbox
                    className={`col-span-3 ${rowClasses}`}
                    label=""
                    options={roleOptions.map((e) => ({ value: e, label: e }))}
                    disabled={isDeactivated}
                    {...form.getInputProps(
                      `sections.identification.team.${index}.role`
                    )}
                  />
                }
                <div className={`col-span-8 flex gap-1 ${rowClasses}`}>
                  {manualInputMode[index] ?
                    <FormInput
                      className="flex-1"
                      placeholder="Nombre del miembro de equipo"
                      label=""
                      type="text"
                      disabled={
                        isDeactivated ||
                        form.getInputProps(
                          `sections.identification.team.${index}.toBeConfirmed`
                        ).value
                      }
                      {...form.getInputProps(
                        `sections.identification.team.${index}.name`
                      )}
                    />
                  : <FormCombobox
                      className="flex-1"
                      label=""
                      placeholder="Seleccione un miembro de equipo"
                      options={
                        teamMembers?.map((e) => ({
                          value: e.id,
                          label: e.name,
                        })) ?? []
                      }
                      disabled={
                        isDeactivated ||
                        form.getInputProps(
                          `sections.identification.team.${index}.toBeConfirmed`
                        ).value
                      }
                      {...form.getInputProps(
                        `sections.identification.team.${index}.teamMemberId`
                      )}
                    />
                  }

                  {manualInputMode[index] ?
                    <Button
                      type="button"
                      className="bg-blue-600 px-2 py-1 text-xs text-white transition-colors hover:bg-blue-700"
                      disabled={
                        isDeactivated ||
                        form.getInputProps(
                          `sections.identification.team.${index}.toBeConfirmed`
                        ).value
                      }
                      onClick={() => toggleManualInput(index)}
                      title="Seleccionar de lista"
                    >
                      <Edit size={16} />
                    </Button>
                  : <Button
                      type="button"
                      plain
                      className="px-2 py-1 text-xs transition-colors hover:bg-gray-100"
                      disabled={
                        isDeactivated ||
                        form.getInputProps(
                          `sections.identification.team.${index}.toBeConfirmed`
                        ).value
                      }
                      onClick={() => toggleManualInput(index)}
                      title="Ingresar manualmente"
                    >
                      <Edit size={16} />
                    </Button>
                  }
                </div>

                <FormInput
                  className={`col-span-2 ${rowClasses}`}
                  label=""
                  type="number"
                  disabled={isDeactivated}
                  {...form.getInputProps(
                    `sections.identification.team.${index}.hours`
                  )}
                />
                <FormInput
                  className={`col-span-2 ${rowClasses}`}
                  label=""
                  type="number"
                  disabled={isDeactivated}
                  {...form.getInputProps(
                    `sections.identification.team.${index}.workingMonths`
                  )}
                />
                {index === 0 ?
                  <span />
                : <div className="mt-1 flex gap-1 self-start">
                    {isDeactivated ?
                      <Button plain title="Reactivar miembro">
                        <UserPlus
                          data-slot="icon"
                          onClick={() => showReactivateDialog(index)}
                          className="text-green-600 hover:text-green-700"
                        />
                      </Button>
                    : <Button plain title="Desactivar miembro">
                        <UserMinus
                          data-slot="icon"
                          onClick={() => showDeactivateDialog(index)}
                        />
                      </Button>
                    }
                    <Button plain>
                      <Trash
                        data-slot="icon"
                        onClick={() =>
                          form.removeListItem(
                            'sections.identification.team',
                            index
                          )
                        }
                      />
                    </Button>
                  </div>
                }
              </Fragment>
            )
          })}
      </div>

      <Button
        outline
        onClick={() => {
          const currentTeamLength =
            form.values.sections.identification.team.length
          const isFirstMember = currentTeamLength === 0

          form.insertListItem('sections.identification.team', {
            hours: null,
            last_name: '',
            name: '',
            role: isFirstMember ? 'Director' : 'Investigador UAP',
            teamMemberId: null,
            workingMonths: 12,
            toBeConfirmed: false,
            categoryToBeConfirmed: null,
            assignments: [],
          })

          setTimeout(() => {
            document
              .getElementById(
                `row-${form.values.sections.identification.team.length}`
              )
              ?.getElementsByTagName('input')[0]
              .focus()
          }, 10)
        }}
        className="mt-4"
      >
        <Plus data-slot="icon" />
        Añadir otro miembro de equipo
      </Button>

      {/* Deactivate Confirmation Dialog */}
      <Dialog
        open={deactivateDialog.open}
        onClose={() =>
          setDeactivateDialog({
            open: false,
            teamMemberIndex: null,
            memberName: '',
          })
        }
        size="lg"
      >
        <DialogTitle>Confirmar desactivación</DialogTitle>
        <DialogDescription>
          ¿Está seguro que desea desactivar a "{deactivateDialog.memberName}"?
          Esta acción marcará el miembro como inactivo pero preservará su
          información en el historial del proyecto.
        </DialogDescription>
        <DialogActions>
          <Button
            plain
            onClick={() =>
              setDeactivateDialog({
                open: false,
                teamMemberIndex: null,
                memberName: '',
              })
            }
          >
            Cancelar
          </Button>
          <Button color="red" onClick={handleDeactivateTeamMember}>
            Desactivar miembro
          </Button>
        </DialogActions>
      </Dialog>

      {/* Reactivate Confirmation Dialog */}
      <Dialog
        open={reactivateDialog.open}
        onClose={() =>
          setReactivateDialog({
            open: false,
            teamMemberIndex: null,
            memberName: '',
          })
        }
        size="lg"
      >
        <DialogTitle>Confirmar reactivación</DialogTitle>
        <DialogDescription>
          ¿Está seguro que desea reactivar a "{reactivateDialog.memberName}"?
          Esta acción marcará el miembro como activo nuevamente en el proyecto.
        </DialogDescription>
        <DialogActions>
          <Button
            plain
            onClick={() =>
              setReactivateDialog({
                open: false,
                teamMemberIndex: null,
                memberName: '',
              })
            }
          >
            Cancelar
          </Button>
          <Button color="green" onClick={handleReactivateTeamMember}>
            Reactivar miembro
          </Button>
        </DialogActions>
      </Dialog>
    </Fieldset>
  )
}

const roleOptions = [
  'Director',
  'Codirector',
  'Investigador UAP',
  'Investigador Externo UAP',
  'Técnico Asistente',
  'Técnico Asociado',
  'Técnico Principal',
  'Profesional Adjunto',
  'Profesional Principal',
  'Becario CONICET',
  'A definir',
]
