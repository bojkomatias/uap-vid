interface TipTapViewerProps {
    title: string
    content: string
}
const TipTapViewer = ({ title, content }: TipTapViewerProps) => {
    return (
        <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">{title}</dt>
            <dd className="mt-1 prose">
                <div dangerouslySetInnerHTML={{ __html: content }} />
            </dd>
        </div>
    )
}

export default TipTapViewer
