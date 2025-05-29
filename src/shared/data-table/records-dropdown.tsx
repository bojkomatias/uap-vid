/* eslint-disable @typescript-eslint/no-unused-vars */
<<<<<<< HEAD
import { useUpdateQuery } from 'hooks/updateQuery'
=======
import { useUpdateQuery } from '@utils/query-helper/updateQuery'
>>>>>>> origin/develop
import { Listbox, ListboxOption } from '@components/listbox'

export default function RecordsDropdown({
  options,
  shownRecords,
  currentPage,
}: {
  options: number[]
  shownRecords: number
  currentPage: number
}) {
  const update = useUpdateQuery()

  return (
    <Listbox defaultValue={shownRecords || 10}>
      {options.slice(0, options.length - 1).map((o, idx) => (
        <ListboxOption
          key={idx}
          value={o}
          onClick={() =>
            update({
              records: o.toString(),
              page:
                o * currentPage > options.at(-1)! ?
                  '1'
                : currentPage.toString(),
            })
          }
        >
          {o}
        </ListboxOption>
      ))}
      <ListboxOption
        value="all-records"
        onClick={() =>
          update({
            records: options.at(-1)!.toString(),
            page: '1',
          })
        }
      >
        Todos
      </ListboxOption>
    </Listbox>
  )
}
