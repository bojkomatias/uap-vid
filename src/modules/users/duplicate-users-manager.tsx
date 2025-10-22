'use client'

import { Button } from '@components/button'
import { Badge } from '@components/badge'
import { notifications } from '@elements/notifications'
import { useState, useTransition } from 'react'
import {
  findDuplicateUsers,
  mergeDuplicateUsers,
  normalizeUserEmails,
} from '@actions/user/duplicate-users'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@components/table'
import { Text } from '@components/text'
import { Strong } from '@components/text'
import { Dialog, DialogActions, DialogBody, DialogDescription, DialogTitle } from '@components/dialog'
import { Field, Label } from '@components/fieldset'
import { Radio, RadioField, RadioGroup } from '@components/radio'

type DuplicateUser = {
  id: string
  email: string
  name: string
  role: string
  lastLogin: Date | null
  protocolCount: number
  reviewCount: number
}

type DuplicateGroup = {
  email: string
  count: number
  users: DuplicateUser[]
}

export function DuplicateUsersManager() {
  const [duplicates, setDuplicates] = useState<DuplicateGroup[]>([])
  const [loading, setLoading] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [mergeDialogOpen, setMergeDialogOpen] = useState(false)
  const [selectedGroup, setSelectedGroup] = useState<DuplicateGroup | null>(null)
  const [primaryUserId, setPrimaryUserId] = useState<string>('')

  const handleFindDuplicates = async () => {
    setLoading(true)
    try {
      const result = await findDuplicateUsers()

      if (result.status && result.data) {
        setDuplicates(result.data)
        notifications.show({
          title: 'Búsqueda completada',
          message: result.message,
          intent: 'success',
        })
      } else {
        notifications.show({
          title: 'Error',
          message: result.message,
          intent: 'error',
        })
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Error al buscar usuarios duplicados',
        intent: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleNormalizeEmails = async () => {
    setLoading(true)
    try {
      const result = await normalizeUserEmails()

      if (result.status) {
        notifications.show({
          title: 'Normalización completada',
          message: result.message,
          intent: 'success',
        })
        // Refresh duplicates after normalization
        handleFindDuplicates()
      } else {
        notifications.show({
          title: 'Error',
          message: result.message,
          intent: 'error',
        })
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Error al normalizar emails',
        intent: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const openMergeDialog = (group: DuplicateGroup) => {
    setSelectedGroup(group)
    // Auto-select the user with most recent login or most data
    const suggestedPrimary = group.users.reduce((best, user) => {
      const userScore = (user.reviewCount || 0) + (user.protocolCount || 0)
      const bestScore = (best.reviewCount || 0) + (best.protocolCount || 0)

      if (userScore > bestScore) return user
      if (userScore === bestScore && user.lastLogin && best.lastLogin) {
        return new Date(user.lastLogin) > new Date(best.lastLogin) ? user : best
      }
      return best
    })
    setPrimaryUserId(suggestedPrimary.id)
    setMergeDialogOpen(true)
  }

  const handleMerge = async () => {
    if (!selectedGroup || !primaryUserId) return

    const duplicateIds = selectedGroup.users
      .filter((u) => u.id !== primaryUserId)
      .map((u) => u.id)

    if (duplicateIds.length === 0) {
      notifications.show({
        title: 'Error',
        message: 'Debes seleccionar un usuario primario diferente a los duplicados',
        intent: 'error',
      })
      return
    }

    startTransition(async () => {
      try {
        // Merge each duplicate into the primary user
        for (const duplicateId of duplicateIds) {
          const result = await mergeDuplicateUsers(primaryUserId, duplicateId)

          if (!result.status) {
            notifications.show({
              title: 'Error al fusionar',
              message: result.message,
              intent: 'error',
            })
            return
          }
        }

        notifications.show({
          title: 'Fusión exitosa',
          message: `Se fusionaron ${duplicateIds.length} usuario(s) duplicado(s)`,
          intent: 'success',
        })

        setMergeDialogOpen(false)
        setSelectedGroup(null)
        setPrimaryUserId('')

        // Refresh the list
        handleFindDuplicates()
      } catch (error) {
        notifications.show({
          title: 'Error',
          message: 'Error al fusionar usuarios',
          intent: 'error',
        })
      }
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        <Button
          onClick={handleFindDuplicates}
          disabled={loading}
          color="dark/white"
        >
          {loading ? 'Buscando...' : 'Buscar Duplicados'}
        </Button>

        <Button
          onClick={handleNormalizeEmails}
          disabled={loading}
          color="light"
        >
          Normalizar Emails
        </Button>
      </div>

      {duplicates.length === 0 && !loading && (
        <Text>
          No se encontraron usuarios duplicados. Haz clic en &quot;Buscar Duplicados&quot; para
          escanear la base de datos.
        </Text>
      )}

      {duplicates.length > 0 && (
        <div className="space-y-8">
          <Text>
            <Strong>
              Se encontraron {duplicates.length} grupo(s) de usuarios duplicados:
            </Strong>
          </Text>

          {duplicates.map((group) => (
            <div
              key={group.email}
              className="rounded-lg border border-zinc-950/10 p-4 dark:border-white/10"
            >
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <Text>
                    <Strong>Email:</Strong> {group.email}
                  </Text>
                  <Badge color="red">
                    {group.count} cuentas duplicadas
                  </Badge>
                </div>
                <Button
                  onClick={() => openMergeDialog(group)}
                  color="red"
                  disabled={isPending}
                >
                  Fusionar Cuentas
                </Button>
              </div>

              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeader>ID</TableHeader>
                    <TableHeader>Nombre</TableHeader>
                    <TableHeader>Rol</TableHeader>
                    <TableHeader>Último Login</TableHeader>
                    <TableHeader>Protocolos</TableHeader>
                    <TableHeader>Evaluaciones</TableHeader>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {group.users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-mono text-xs">
                        {user.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>
                        <Badge color="gray">{user.role}</Badge>
                      </TableCell>
                      <TableCell>
                        {user.lastLogin ?
                          new Date(user.lastLogin).toLocaleDateString()
                        : 'Nunca'}
                      </TableCell>
                      <TableCell>{user.protocolCount}</TableCell>
                      <TableCell>{user.reviewCount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </div>
      )}

      {/* Merge Dialog */}
      <Dialog open={mergeDialogOpen} onClose={() => setMergeDialogOpen(false)}>
        <DialogTitle>Fusionar Usuarios Duplicados</DialogTitle>
        <DialogDescription>
          Selecciona qué cuenta quieres mantener. Los protocolos y evaluaciones de las
          otras cuentas se transferirán a esta cuenta y las cuentas duplicadas serán
          eliminadas.
        </DialogDescription>
        <DialogBody>
          {selectedGroup && (
            <Field>
              <Label>Cuenta a mantener (primaria)</Label>
              <RadioGroup value={primaryUserId} onChange={setPrimaryUserId}>
                {selectedGroup.users.map((user) => (
                  <RadioField key={user.id}>
                    <Radio value={user.id} />
                    <Label>
                      <div className="flex flex-col">
                        <Strong>{user.name}</Strong>
                        <Text className="text-sm">
                          {user.role} • {user.protocolCount} protocolo(s) •{' '}
                          {user.reviewCount} evaluación(es)
                        </Text>
                        <Text className="text-xs text-zinc-500">
                          Último login:{' '}
                          {user.lastLogin ?
                            new Date(user.lastLogin).toLocaleDateString()
                          : 'Nunca'}
                        </Text>
                      </div>
                    </Label>
                  </RadioField>
                ))}
              </RadioGroup>
            </Field>
          )}
        </DialogBody>
        <DialogActions>
          <Button plain onClick={() => setMergeDialogOpen(false)}>
            Cancelar
          </Button>
          <Button color="red" onClick={handleMerge} disabled={!primaryUserId || isPending}>
            {isPending ? 'Fusionando...' : 'Fusionar Usuarios'}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
