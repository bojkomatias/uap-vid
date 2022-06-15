function UserList({ users }: any) {
    const router = useRouter()

    const refreshData = () => {
        router.replace(router.asPath)
    }

    const UpdateRoleForUser = async (id: any, newRole: string) => {
        console.log(id, newRole)
        const res = await fetch(`/api/users/${id}`, {
            method: 'PUT',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ role: newRole }),
        })
        console.log(await res.json())
        refreshData()
    }
    return (
        <div>
            <div className="flex items-center justify-around gap-6 text-xl font-bold">
                <p>Email</p>
                <p className="-translate-x-8">Último inicio de sesión</p>
                <p className="-translate-x-10">Rol</p>
            </div>
            {users.map((user: any) => (
                <div key={user.email} className="p-10 text-primary">
                    <div className="flex items-center justify-around gap-6">
                        <p>{user.email}</p>
                        <div className="flex gap-3">
                            {' '}
                            <p>
                                {new Date(user.lastLogin).toLocaleDateString(
                                    'es-ar'
                                )}
                            </p>
                            <p>
                                {new Date(user.lastLogin).toLocaleTimeString(
                                    'es-ar'
                                )}
                            </p>
                        </div>

                        <ListBox
                            user={user}
                            UpdateRoleForUser={UpdateRoleForUser}
                        />
                    </div>
                </div>
            ))}
        </div>
    )
}

export default UserList

// You should use getServerSideProps when:
// - Only if you need to pre-render a page whose data must be fetched at request time
import { GetServerSideProps } from 'next'
import { useRouter } from 'next/router'
import ListBox from '../../../components/Atomic/Listbox'

export const getServerSideProps: GetServerSideProps = async () => {
    const string = `${process.env.NEXTURL}/api/users/`
    const data = await fetch(string).then((res) => res.json())

    return {
        props: {
            users: data,
        },
    }
}
