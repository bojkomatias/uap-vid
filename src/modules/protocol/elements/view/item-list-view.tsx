import { cx } from '@utils/cx'
import { EmptyStateItem } from './empty-state-item'

interface DeepValue {
    groupLabel: string
    data: ListRowValues[]
}
interface ItemListProps {
    data: {
        title: string
        values?: ListRowValues[]
        deepValues?: DeepValue[]
    }
    footer?: React.ReactNode
}
const ItemListView = ({ data, footer }: ItemListProps) => {
    return (
        <div className="sm:col-span-2">
            <dt className="text-sm font-medium text-gray-500">{data.title}</dt>
            {data.values && data.values.length > 0 ? (
                <dd className="mt-1 text-sm text-gray-900">
                    <div className="mt-2 flex flex-col divide-y rounded-lg border pt-2">
                        {data.values.map((row, index) => (
                            <ListRow data={row} key={index} />
                        ))}
                    </div>
                </dd>
            ) : data.deepValues && data.deepValues.length > 0 ? (
                <dd className="mt-1 text-sm text-gray-900">
                    <div className="mt-2 flex flex-col divide-y overflow-hidden rounded-lg border">
                        {data.deepValues.some((e) => e.data.length > 0) ? (
                            data.deepValues.map((item, i) => (
                                <>
                                    {item.data.length === 0 ? null : (
                                        <div key={i} className="space-y-0 pt-3">
                                            <span className="ml-4 text-sm font-semibold text-gray-500">
                                                {item.groupLabel}:
                                            </span>
                                            {item.data.map((row, index) => (
                                                <ListRow
                                                    data={row}
                                                    key={index}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </>
                            ))
                        ) : (
                            <span className="mx-auto w-fit py-3 text-sm text-gray-400">
                                Sin elementos cargados.
                            </span>
                        )}
                    </div>
                </dd>
            ) : (
                <EmptyStateItem />
            )}
            {footer}
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
            className={cx(
                'relative place-items-center space-y-2 px-4 py-2 sm:grid sm:space-y-0',
                data.length == 2 && 'grid-cols-2',
                data.length == 3 && 'grid-cols-3',
                data.length == 4 && 'grid-cols-4'
            )}
        >
            {data.map((item, index) => (
                <div
                    key={index}
                    className="first:place-self-start last:place-self-end last:text-right"
                >
                    <p
                        className={cx(
                            'text-sm text-gray-500',
                            !item.inverted && 'font-medium text-gray-900'
                        )}
                    >
                        {item.up}
                    </p>
                    <p
                        className={cx(
                            'text-sm text-gray-500',
                            !item.inverted && 'font-medium text-gray-900'
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
