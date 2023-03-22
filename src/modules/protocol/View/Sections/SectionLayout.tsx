import React from 'react'
interface SectionLayoutProps {
    title: string
    description: string,
    children: React.ReactNode
}
const SectionLayout = ({ title, description, children } : SectionLayoutProps) => {
    return (
        <>
            <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg font-semibold leading-6 text-gray-900">
                    {title}
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    {description}
                </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
                    {children}
                </dl>
            </div>
        </>
    )
}

export default SectionLayout
