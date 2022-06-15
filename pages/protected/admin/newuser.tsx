import { useState } from 'react'
import { Button } from '../../../components/Atomic/Button'

function NewUser() {
    const [newUser, setNewUser] = useState({})
    return (
        <div>
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    console.log('Submitting', newUser)
                }}
            >
                <input
                    type="text"
                    name="name"
                    onChange={(e) =>
                        setNewUser({
                            ...newUser,
                            [e.target.name]: e.target.value,
                        })
                    }
                />{' '}
                <input
                    type="email"
                    name="email"
                    onChange={(e) =>
                        setNewUser({
                            ...newUser,
                            [e.target.name]: e.target.value,
                        })
                    }
                />
                <input
                    type="password"
                    name="password"
                    onChange={(e) =>
                        setNewUser({
                            ...newUser,
                            [e.target.name]: e.target.value,
                        })
                    }
                />
                LISTBOX ROLE
                <Button type="submit"> Crear Nuevo Usuario</Button>
            </form>
        </div>
    )
}

export default NewUser
