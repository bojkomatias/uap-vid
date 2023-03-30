import { UserAuth } from '@auth/UserAuth'
import Image from 'next/image'
import Link from 'next/link'

export const Nav = () => {
    return (
        <nav className="w-screen bg-primary">
            <div className="mx-6 flex h-24 max-w-7xl items-center justify-between text-white lg:mx-16 2xl:mx-auto">
                <div>
                    <Link href="/protocols" passHref>
                        <Image
                            src="/UAP-logo-home.png"
                            width={200}
                            height={60}
                            alt="UAP LOGO"
                        />
                        <p className="hidden text-center text-[10px] uppercase tracking-widest text-white/80 md:block">
                            Investigación y Desarrollo
                        </p>
                    </Link>
                </div>
                <div className="flex items-center gap-2">
                    <UserAuth />
                </div>
            </div>
        </nav>
    )
}
