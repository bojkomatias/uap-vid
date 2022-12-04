/* This example requires Tailwind CSS v2.0+ */

export function Footer() {
    return (
        <footer className="my-auto flex h-[10vh] flex-col items-center justify-center bg-primary text-center text-xs text-white">
            <div className="flex gap-3">
                <div>© COPYRIGHT 2022</div>
                <a href="https://uap.edu.ar/">
                    <p className="transition-all duration-500 hover:scale-105 hover:font-bold">
                        {' '}
                        UNIVERSIDAD ADVENTISTA DEL PLATA
                    </p>
                </a>{' '}
            </div>
            <div className="mt-2 flex gap-1">
                <div className="font-thin">WebApp desarrollada por </div>
                <a href="/">
                    <p className="font-thin transition-all duration-200 hover:ml-1 hover:rotate-[7deg] hover:scale-125 hover:font-bold">
                        TPC
                    </p>
                </a>
            </div>
        </footer>
    )
}
