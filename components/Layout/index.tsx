import Footer from './Footer'
import Nav from './Nav'

const Layout = ({ children }: any) => {
    return (
        <>
            <Nav />
            <main>{children}</main>
            <Footer />
        </>
    )
}

export default Layout
