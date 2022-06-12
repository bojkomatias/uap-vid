import { signIn, useSession } from 'next-auth/react'
import React from 'react'
import { Button } from '../components/Atomic/Button'

function SignIn() {
    const { data: session } = useSession()
    console.log(session)
    return (
        <div>
            <Button onClick={() => signIn('azure-ad-b2c')}>
                Sign In With AD B2C
            </Button>

            <Button
                onClick={() => {
                    console.log('xs')
                    signIn(
                        'credentials', 
                        { redirect },
                        {
                            email: 'test@test.com',
                            password: '123',
                        }
                    )
                }}
            >
                Login with Creds
            </Button>
        </div>
    )
}

export default SignIn
