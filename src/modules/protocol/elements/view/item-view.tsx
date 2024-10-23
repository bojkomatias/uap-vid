import React from 'react'
import { EmptyStateItem } from './empty-state-item'
import {
  DescriptionDetails,
  DescriptionTerm,
} from '@components/description-list'
interface ShortDataProps {
  title: string
  value: string | null
}
const ItemView = ({ title, value }: ShortDataProps) => {
  return (
    <>
      {title === 'Materia' && value && value.length <= 0 ? null : (
        <>
          <DescriptionTerm>{title}</DescriptionTerm>
          {value ?
            <DescriptionDetails>{value}</DescriptionDetails>
          : <DescriptionDetails>
              <EmptyStateItem />
            </DescriptionDetails>
          }
        </>
      )}
    </>
  )
}

export default ItemView
