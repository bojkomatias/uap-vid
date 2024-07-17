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
    <>
      <Heading>{title}</Heading>
      <Text>{description}</Text>
      <Divider />
      <DescriptionList>{children}</DescriptionList>
    </>
  )
}

export default SectionViewer
