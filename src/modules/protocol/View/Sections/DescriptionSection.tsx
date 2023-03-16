import { ProtocolSectionsDescription } from '@prisma/client'
import ShortDataList from '@protocol/elements/ShortData/ShortDataList'
import React from 'react'
import SectionLayout from './SectionLayout'
interface DescriptionSectionProps {
   data: ProtocolSectionsDescription
}
const DescriptionSection = ({data}:DescriptionSectionProps) => {
   const shortData = [
      {
         title: 'Campo',
         value: data.field,
      },
      {
         title: 'Disciplina',
         value: data.discipline,
      },
      {
         title: 'Línea de investigación',
         value: data.line,
      },
      {
         title: 'Tipo de investigación',
         value: data.type,
      },
      {
         title: 'Objetivo',
         value: data.objective,
      },
      {
         title: 'Palabras clave',
         value: data.words,
      }
   ]
  return (
    <SectionLayout title="Descripción" description="Descripción del proyecto">
         <ShortDataList data={shortData} />
      </SectionLayout>
  )
}

export default DescriptionSection