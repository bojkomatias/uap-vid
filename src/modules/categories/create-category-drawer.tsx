'use client'
import CategoryForm from './category-form'
import CustomDrawer from '@elements/custom-drawer'

export default function CreateCategoryDrawer() {
    

    return (
        <CustomDrawer title='Crear categoría nueva' path='/categories/new'> <CategoryForm
        column={true}
        />
        </CustomDrawer>
    )
}
