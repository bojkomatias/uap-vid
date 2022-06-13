import Footer from './Footer'
import Nav from './Nav'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const Layout = ({ children }: any) => {
    return (
        <>
            <Nav />
            <motion.main
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="shadowCustom mx-auto my-20  min-h-[70vh] max-w-[1280px] scale-[85%] opacity-0 transition-all duration-150 2xl:scale-100"
            >
                {children}
            </motion.main>
            <Footer />
        </>
    )
}

export default Layout
