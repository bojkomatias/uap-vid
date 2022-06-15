import { exhibits } from '../config/exhibit'
export default function Exhibit() {
    return (
        <>
            {' '}
            <div className="-translate-y-8 text-4xl font-bold text-primary">
                Anexos
            </div>
            {/* Vamos a poner a disposicion los archivos */}
            {/* <div className="prose prose-zinc mx-auto max-h-[80vh] overflow-auto rounded-md border-base-200 border px-24 prose-p:pl-6">
                {exhibits.A()}
            </div> */}
            <div className='mx-48 flex flex-col gap-12'>
            <a href="/AnexoA.docx" className='flex items-center bg-base-100 p-4 uppercase transition-all duration-200 hover:scale-[102%] hover:bg-primary hover:text-white active:scale-[99%]' download> Anexo A </a>
            <a href="/AnexoB.docx" className='flex items-center bg-base-100 p-4 uppercase transition-all duration-200 hover:scale-[102%] hover:bg-primary hover:text-white active:scale-[99%]' download>Anexo B </a>
            <a href="/AnexoC.docx" className='flex items-center bg-base-100 p-4 uppercase transition-all duration-200 hover:scale-[102%] hover:bg-primary hover:text-white active:scale-[99%]' download>Anexo C </a>
            <a href="/AnexoD.docx" className='flex items-center bg-base-100 p-4 uppercase transition-all duration-200 hover:scale-[102%] hover:bg-primary hover:text-white active:scale-[99%]' download>Anexo D </a>
            </div>
    </>
    )
}
