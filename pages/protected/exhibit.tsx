export default function Exhibit() {
    return (
        <>
            {' '}
            <div className="-translate-y-12 text-4xl font-bold text-primary">
                Anexos
            </div>
            <div className="mx-48 flex flex-col gap-12">
                <a
                    href="/AnexoA.docx"
                    className="flex items-center bg-base-100 p-4 uppercase transition-all duration-200 hover:scale-[102%] hover:bg-primary hover:text-white active:scale-[99%]"
                    download
                >
                    {' '}
                    Anexo A{' '}
                </a>
                <a
                    href="/AnexoB.docx"
                    className="flex items-center bg-base-100 p-4 uppercase transition-all duration-200 hover:scale-[102%] hover:bg-primary hover:text-white active:scale-[99%]"
                    download
                >
                    Anexo B{' '}
                </a>
                <a
                    href="/AnexoC.docx"
                    className="flex items-center bg-base-100 p-4 uppercase transition-all duration-200 hover:scale-[102%] hover:bg-primary hover:text-white active:scale-[99%]"
                    download
                >
                    Anexo C{' '}
                </a>
                <a
                    href="/AnexoD.docx"
                    className="flex items-center bg-base-100 p-4 uppercase transition-all duration-200 hover:scale-[102%] hover:bg-primary hover:text-white active:scale-[99%]"
                    download
                >
                    Anexo D{' '}
                </a>
            </div>
        </>
    )
}
