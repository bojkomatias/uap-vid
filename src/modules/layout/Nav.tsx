import { UserAuth } from '@auth/UserAuth'
import Image from 'next/image'
import Link from 'next/link'

export const Nav = () => (
    <nav className="w-screen bg-primary">
        <div className="mx-2 flex h-[10vh] max-w-7xl items-center justify-between text-white sm:mx-6 md:mx-12 lg:mx-16 2xl:mx-auto">
            <div className="text-center text-[10px] uppercase tracking-wider">
                <Link href="/protocols" passHref>
                    <Image
                        src="/UAP-logo-home.png"
                        width={200}
                        height={50}
                        alt="UAP LOGO"
                    />
                    <p className="hidden md:block">
                        Vicerrectoría de Investigación y Desarrollo
                    </p>
                </Link>
            </div>
            <div className="flex items-center gap-2">
                <UserAuth />
            </div>
        </div>
    </nav>
)
