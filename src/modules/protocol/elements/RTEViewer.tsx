interface RTEViewerProps {
    title: string
    content: string
}
const RTEViewer = ({ title, content }: RTEViewerProps) => {
    return (
        <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">{title}</dt>
            <dd className="mt-1 text-sm text-gray-900">
                <div className="grid grid-cols-1 border mt-2 p-4 rounded-lg divide-y">
                    {/* render content that is html string */}
                    <div dangerouslySetInnerHTML={{ __html: content }} />
                </div>
            </dd>
        </div>
    )
}

export default RTEViewer
