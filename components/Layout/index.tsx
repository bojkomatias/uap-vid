import Footer from './Footer'
import Nav from './Nav'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

import { useRouter } from 'next/router'

const Layout = ({ children }: any) => {
    const route = useRouter().pathname

    if (route === '/') {
        return (
            <>
                <Nav />
                <motion.main
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="mx-auto my-28 min-h-[70vh] w-[500px] scale-[75%] opacity-0 transition-all duration-150 xl:scale-[85%] 2xl:scale-100"
                >
                    {children}
                </motion.main>
                <Footer />
            </>
        )
    } else
        return (
            <>
                <Nav />
                <motion.main
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="shadowCustom mx-auto my-20 min-h-[70vh] max-w-[1280px] scale-[85%] opacity-0 transition-all duration-150 2xl:scale-100"
                >
                    {children}
                </motion.main>
                <Footer />
            </>
        )
}

export default Layout
