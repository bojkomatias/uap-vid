import { signIn } from 'next-auth/react'
import React from 'react'
import { Button } from '../components/Atomic/Button'

function SignIn() {
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
                        {
                            email: 'admin@admin.com',
                            password: 'admin123',
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
