import Footer from './Footer'
import Nav from './Nav'

const Layout = ({ children }: any) => {
    return (
        <>
            <Nav />
            <div className="text-primary mx-auto mt-10 w-[1280px] translate-y-2 translate-x-6 text-4xl font-bold">
                Inicio
            </div>
            <main className="shadowCustom mx-auto mb-28 h-[80vh] w-[1280px] rounded-[5] p-10">
                {children}
            </main>
            <Footer />
        </>
    )
}

export default Layout
