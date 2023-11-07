import React from 'react'

export default function Layout({
    children,
    drawer,
}: {
    children: React.ReactNode
    drawer: React.ReactNode
}) {
    return (
        <main>
            {children} {drawer}
        </main>
    )
}
