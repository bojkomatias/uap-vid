import { exhibits } from '../config/exhibit'
export default function Exhibit() {
    return (
        <>
            {' '}
            <div className="-translate-y-8 text-4xl font-bold text-primary">
                Anexo {}
            </div>
            <div className="prose prose-zinc mx-auto max-h-[80vh] overflow-auto rounded-md border p-6 prose-p:pl-6">
                {exhibits.A()}
            </div>
        </>
    )
}
