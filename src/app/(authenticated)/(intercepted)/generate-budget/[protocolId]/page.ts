import { redirect } from 'next/navigation'

// No point in accessing it from here! Just do the round trip.
export default function Page() {
    redirect('/protocols')
}
