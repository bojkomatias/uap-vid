import React from 'react'
import CustomDrawer from '@elements/custom-drawer'
import { ConvocatoryForm } from './convocatory-form'

export default function CreateConvocatoryDrawer() {
  return (
    <CustomDrawer path="/convocatories/new" title="Crear convocatoria nueva">
      <ConvocatoryForm
        convocatory={{
          name: '',
          from: new Date(),
          to: new Date(),
          year: new Date().getFullYear(),
        }}
        isNew={true}
      />
    </CustomDrawer>
  )
}
