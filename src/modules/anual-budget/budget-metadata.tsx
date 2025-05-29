import { Badge, BadgeButton } from '@components/badge'
import { Button } from '@components/button'
import { Heading, Subheading } from '@components/heading'
import { Text } from '@components/text'
import { ContainerAnimations } from '@elements/container-animations'
import type { AnualBudget } from '@prisma/client'
import {
  AnualBudgetStateColorDictionary,
  AnualBudgetStateDictionary,
} from '@utils/dictionaries/AnualBudgetStateDictionary'
import { dateFormatter } from '@utils/formatters'
<<<<<<< HEAD
import Info from '@shared/info'
=======
import Info from 'modules/info'
>>>>>>> origin/develop
import Link from 'next/link'

export const BudgetMetadata = ({
  title,
  sponsor,
  createdAt,
  updatedAt,
  state,
  year,
  protocolId,
  children,
}: Omit<AnualBudget, 'budgetItems'> & {
  title: string
  sponsor: string[]
  year: number
  children: React.ReactNode
  protocolId: string
}) => {
  return (
    <ContainerAnimations animation={5}>
      <div className="mb-8 mt-2 flex w-full flex-col justify-between gap-2 rounded-lg bg-gray-200/75 px-4 py-4 leading-relaxed drop-shadow-sm dark:bg-gray-800/90 md:flex-row print:hidden">
        <div>
          {' '}
          <Link
            className="transition-all duration-300 hover:opacity-80"
            title="Ir al protocolo de investigación"
            href={`/protocols/${protocolId}`}
          >
            <Heading>{title}</Heading>
          </Link>
          <Subheading>{`Presupuesto ${year}`}</Subheading>
          <div className="flex items-baseline">
            <div className="flex-grow">
              <div className="flex flex-col gap-2 md:flex-row">
                <div className="flex gap-2">
                  <Text>Creado:</Text>
                  <Subheading>{dateFormatter.format(createdAt)}</Subheading>
                </div>
                <div className="flex gap-2">
                  <Text>Última edición:</Text>
                  <Subheading>{dateFormatter.format(updatedAt)}</Subheading>
                </div>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Text>Ente patrocinante:</Text>
            <Subheading>{sponsor.join(', ')}</Subheading>
          </div>
        </div>
        <div className="flex grow flex-col justify-between">
          <div className="self-end">
            {state === 'PENDING' ?
              <Info
                content={
                  <>
                    Para regenerar el presupuesto, puede dirigirse a la{' '}
                    <BadgeButton
                      className="!text-sm"
                      href={`/protocols/${protocolId}`}
                    >
                      página del protocolo
                    </BadgeButton>{' '}
                    y volver a generar el presupuesto.
                  </>
                }
              >
                <Badge
                  className="!text-sm/6 font-semibold"
                  color={AnualBudgetStateColorDictionary[state]}
                >
                  {AnualBudgetStateDictionary[state]}
                </Badge>
              </Info>
            : <Badge
                className="!text-sm/6 font-semibold"
                color={AnualBudgetStateColorDictionary[state]}
              >
                {AnualBudgetStateDictionary[state]}
              </Badge>
            }
          </div>
          <div className="self-end">{children}</div>
        </div>
      </div>
    </ContainerAnimations>
  )
}
