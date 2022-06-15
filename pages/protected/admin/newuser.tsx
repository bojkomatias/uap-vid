import { useState } from 'react'
import { Button } from '../../../components/Atomic/Button'

function NewUser() {
    const [newUser, setNewUser] = useState({})
    return (
        <>
            <div className="grow">
                <form
                    className="h-full"
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
                </form>
            </div>
            <button
                className="mr-16 mb-10 w-full p-4 font-bold text-primary transition-all duration-200 hover:bg-primary hover:text-white"
                type="submit"
            >
                {' '}
                Crear Nuevo Usuario
            </button>
        </>
    )
}

export default NewUser
