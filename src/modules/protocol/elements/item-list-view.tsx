import clsx from 'clsx'
import { EmptyStateItem } from './empty-state-item'

interface ItemListProps {
    data: {
        title: string
        values: ListRowValues[]
    }
}
const ItemListView = ({ data }: ItemListProps) => {
    return (
        <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">{data.title}</dt>
            {data.values.length > 0 ? (
                <dd className="mt-1 text-sm text-gray-900">
                    <div className="mt-2 flex flex-col divide-y rounded-lg border">
                        {data.values.map((row, index) => (
                            <ListRow data={row} key={index} />
                        ))}
                    </div>
                </dd>
            ) : (
                <EmptyStateItem />
            )}
        </div>
    )
}
export type ListRowValues = {
    up: string
    down: string | number
    inverted?: boolean
}[]

const ListRow = ({ data }: { data: ListRowValues }) => {
    return (
        <div
            className={clsx(
                'relative place-items-center space-y-2 px-4 py-4 sm:grid sm:space-y-0',
                {
                    'grid-cols-2': data.length == 2,
                    'grid-cols-3': data.length == 3,
                    'grid-cols-4': data.length == 4,
                }
            )}
        >
            {data.map((item, index) => (
                <div
                    key={index}
                    className="first:place-self-start last:place-self-end last:text-right"
                >
                    <p
                        className={clsx(
                            { 'font-medium text-gray-900': !item.inverted },
                            'text-sm text-gray-500'
                        )}
                    >
                        {item.up}
                    </p>
                    <p
                        className={clsx(
                            { 'font-medium text-gray-900': item.inverted },
                            'text-sm text-gray-500'
                        )}
                    >
                        {item.down}
                    </p>
                </div>
            ))}
        </div>
    )
}

export default ItemListView
