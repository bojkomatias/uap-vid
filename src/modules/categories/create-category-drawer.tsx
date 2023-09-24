'use client'
import { Drawer } from '@mantine/core'
import { usePathname, useRouter } from 'next/navigation'
import CategoryForm from './category-form'

export default function CreateCategoryDrawer() {
    const path = usePathname()
    const router = useRouter()

    const closeFn = () => {
        document.getElementById('drawer-overlay')?.classList.add('fade-out')
        document
            .getElementById('drawer-content')
            ?.classList.add('fade-out-right')
        setTimeout(() => {
            router.back()
        }, 300)
    }

    return (
        <Drawer.Root
            closeOnEscape
            position="right"
            opened={path == '/categories/new'}
            onClose={() => closeFn()}
        >
            <Drawer.Overlay id="drawer-overlay" className="fade-in" />
            <Drawer.Content id="drawer-content" className="fade-in-right">
                <Drawer.Header>
                    <Drawer.Title className="font-semibold text-gray-600">
                        Crear Categoría
                    </Drawer.Title>
                    <Drawer.CloseButton />
                </Drawer.Header>
                <Drawer.Body className="mx-3 rounded-md bg-gray-50 p-4 shadow-md">
                    <CategoryForm
                        closeInterceptingDrawer={() => closeFn()}
                        column={true}
                    />
                </Drawer.Body>
            </Drawer.Content>
        </Drawer.Root>
    )
}
