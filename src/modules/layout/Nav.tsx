import { UserAuth } from '@auth/UserAuth'

export const Nav = () => (
    <nav className="w-screen  bg-primary">
        <div className="mx-20 flex h-[10vh] max-w-[1280px] items-center justify-between text-white 2xl:m-auto">
            <div className="text-center text-[10px] uppercase tracking-wider transition-all duration-200 hover:scale-[1.01] active:scale-[0.99]">
                <a href="/protected/">
                    <img src="/UAP-logo-home.png"></img>
                    <p>Vicerrectoría de Investigación y Desarrollo</p>
                </a>
            </div>
            <div className="flex items-center gap-2">
                <UserAuth />
            </div>
        </div>
    </nav>
)
