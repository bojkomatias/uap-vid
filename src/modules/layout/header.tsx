import { UserDropdown } from '@auth/user-dropdown'
import Image from 'next/image'
import Link from 'next/link'

export const Header = () => {
    return (
        <nav className="w-screen bg-primary">
            <div className="mx-6 flex h-24 max-w-7xl items-center justify-between text-white lg:mx-16 2xl:mx-auto">
                <div className="text-center text-[10px] font-light uppercase tracking-wider">
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
                    <UserDropdown />
                </div>
            </div>
        </nav>
    )
}
