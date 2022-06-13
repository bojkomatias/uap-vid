import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { Button } from '../components/Atomic/Button'

function SignIn() {
    const { data: session } = useSession()
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    useEffect(() => {
        if (session) {
            console.log(session)
            router.push('/protected')
        }
    }, [session])

    return (
        <div>
            <Button onClick={() => signIn('azure-ad')}>Sign In With AD</Button>

            <form
                onSubmit={(e: any) => {
                    e.preventDefault()
                    console.log(process.env.NEXTAUTH_URL)
                    signIn('credentials', {
                        email: email,
                        password: password,
                        redirect: false,
                    })
                }}
            >
                <input
                    type="email"
                    className="input"
                    placeholder="Email"
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    className="input"
                    placeholder="Password"
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button type="submit">SAPE</Button>
            </form>
        </div>
    )
}

export default SignIn
