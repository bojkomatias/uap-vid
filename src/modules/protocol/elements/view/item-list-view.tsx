import { cx } from '@utils/cx'
import { EmptyStateItem } from './empty-state-item'
import {
  DescriptionDetails,
  DescriptionTerm,
} from '@components/description-list'
import { Strong, Text } from '@components/text'
import type { ReactNode } from 'react'
import { Fragment } from 'react'

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
    <>
      <DescriptionTerm>{data.title}</DescriptionTerm>
      {data.values && data.values.length > 0 ?
        <DescriptionDetails>
          {data.values.map((row, index) => (
            <Fragment key={index}>
              <ListRow data={row} />
            </Fragment>
          ))}
        </DescriptionDetails>
      : data.deepValues && data.deepValues.length > 0 ?
        <DescriptionDetails>
          {data.deepValues.some((e) => e.data.length > 0) ?
            data.deepValues.map((item, i) =>
              item.data.length === 0 ?
                null
              : <Fragment key={i}>
                  <Text className="mt-1 font-medium italic">
                    {item.groupLabel}
                  </Text>
                  {item.data.map((row, index) => (
                    <ListRow data={row} key={index} />
                  ))}
                </Fragment>
            )
          : <EmptyStateItem isOptional />}
        </DescriptionDetails>
      : <EmptyStateItem />}
      {footer}
    </>
  )
}
export type ListRowValues = {
  up: string
  down: string | number | ReactNode
  inverted?: boolean
}[]

const ListRow = ({ data }: { data: ListRowValues }) => {
  return (
    <div
      className={cx(
        'relative grid place-items-center',
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
          {item.inverted ?
            <>
              <Strong>{item.up}</Strong>
              <Text>{item.down}</Text>
            </>
          : <>
              <Strong>{item.up}</Strong>
              <Text>{item.down}</Text>
            </>
          }
        </div>
      ))}
    </div>
  )
}

export default ItemListView
