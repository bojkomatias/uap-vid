import { DescriptionList } from '@components/description-list'
import { Divider } from '@components/divider'
import { Heading, Subheading } from '@components/heading'
import { Text } from '@components/text'
import React from 'react'
interface SectionLayoutProps {
  title: string
  description: string
  children: React.ReactNode
}
const SectionViewer = ({
  title,
  description,
  children,
}: SectionLayoutProps) => {
  return (
    <div>
      <Heading>{title}</Heading>
      <Text>{description}</Text>
      <Divider className="mt-2" />
      <DescriptionList>{children}</DescriptionList>
    </div>
  )
}

export default SectionViewer
