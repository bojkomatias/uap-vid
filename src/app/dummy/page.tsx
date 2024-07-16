import { Combobox } from '@components/combobox'

export default function Page() {
  return (
    <Combobox
      options={[
        { value: '1', label: 'Matute' },
        { value: '2', label: 'Amilcar' },
        { value: '3', label: 'Nicoleto' },
      ]}
    />
  )
}
