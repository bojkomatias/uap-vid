import Footer from './Footer'
import Nav from './Nav'

const Layout = ({ children }: any) => {
    return (
        <>
            <Nav />

            <main className="shadowCustom mx-auto my-28 min-h-[65vh] w-[1280px] rounded-[5]">
                {children}
            </main>
            <Footer />
        </>
    )
}

export default Layout
