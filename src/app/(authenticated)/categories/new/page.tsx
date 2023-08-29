import { canAccess } from '@utils/scopes'
import { authOptions } from 'app/api/auth/[...nextauth]/route'
import CategoryForm from 'modules/categories/category-form'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import React from 'react'

export default async function Page() {
    const session = await getServerSession(authOptions)
    if (!session) return
    if (!canAccess('USERS', session.user.role)) redirect('/protocols')
    return <CategoryForm />
}
