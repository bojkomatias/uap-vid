'use client'

import { Drawer } from '@mantine/core'
import { usePathname, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import CategoryForm from './category-form'

export default function CreateCategoryDrawer() {
    const path = usePathname()
    const router = useRouter()

    return (
        <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <Drawer.Root
                closeOnEscape
                position="right"
                opened={path == '/categories/new'}
                onClose={() => {
                    document
                        .getElementById('drawer-overlay')
                        ?.classList.add('fade-out')
                    document
                        .getElementById('drawer-content')
                        ?.classList.add('fade-out-right')
                    setTimeout(() => {
                        router.back()
                    }, 300)
                }}
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
                        <CategoryForm column={true} />
                    </Drawer.Body>
                </Drawer.Content>
            </Drawer.Root>
        </motion.span>
    )
}
