import React from 'react'

import { redirect } from 'next/navigation'

export default function Page() {
    redirect('/protected')
    return <div>page</div>
}
