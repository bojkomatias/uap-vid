import { PropsWithChildren, useState, useEffect } from 'react'
import { Section, Input as InputT } from '../../config/types'
import Input from '../Atomic/Input'
import Select from '../Atomic/Select'
import Table from '../Atomic/Table'
import TextEditor from '../Atomic/TextEditor'
import { QuestionMark, X } from 'tabler-icons-react'
import gsap from 'gsap'
import { Helpers } from '../../config/helpers'
import { InputType } from '../../config/enums'
import { getConditionalValues } from '../../config/conditionals'

export const Form = ({
    section,
    updateSection,
    setSectionComplete,
}: PropsWithChildren<{
    section: Section
    updateSection: Function
    setSectionComplete: Function
}>) => {
    const [sectionData, setsectionData] = useState<InputT[]>(section.data)
    const [sectionEdited, setSectionEdited] = useState<Section>(section)

    const idempotentUpdateValue = (e: InputT) => {
        let newData = sectionData
        let index = sectionData.findIndex((x) => x.title === e.title)
        if (index !== -1) {
            newData.splice(index, 1, e)
            if (
                sectionData[index].conditional ||
                sectionData[index].conditionalValues
            ) {
                newData.splice(
                    index + 1,
                    0,
                    ...getConditionalValues(
                        e.title,
                        e.value,
                        e.conditionalValues
                    )
                )
            }
        }
        console.log('new', newData)
        // const resData = newData.reduce((a, c) => {
        //     ;(c.conditional || c.conditionalValues) && c.value
        //         ? a.push(
        //               c,
        //               ...getConditionalValues(
        //                   c.title,
        //                   c.value,
        //                   c.conditionalValues
        //               )
        //           )
        //         : a.push(c)
        //     return a
        // }, [] as InputT[])

        setSectionEdited({ ...sectionEdited, data: newData })
        updateSection(sectionEdited)

        return setsectionData(newData)
    }

    useEffect(() => {
        const complete = sectionData.filter((e) => e.value === null)
        setSectionComplete(false)
        console.log('is COMPLETE?', complete.length === 0)
        if (complete.length === 0) setSectionComplete(true)

        setsectionData(section.data)

        gsap.fromTo(
            '#container',
            { opacity: 0, scale: 0.97 },
            { opacity: 1, scale: 1, duration: 0.5 }
        )
    }, [section])

    const renderInputData = (i: InputT) => {
        switch (i.type) {
            case InputType.table:
                return (
                    <Table
                        key={i.title}
                        data={i}
                        updateData={(e: any) => idempotentUpdateValue(e)}
                    />
                )
            case InputType.select:
                return (
                    <Select
                        key={i.title}
                        data={i}
                        updateData={(e: any) => idempotentUpdateValue(e)}
                    />
                )
            case InputType.textarea:
                return (
                    <TextEditor
                        key={i.title}
                        data={i}
                        updateData={(e: any) => idempotentUpdateValue(e)}
                    />
                )
            default:
                return (
                    <Input
                        key={i.title}
                        input={i}
                        updateData={(e: any) => idempotentUpdateValue(e)}
                    />
                )
        }
    }

    return (
        <div id="container" className="w-full opacity-0 ">
            <form
                onSubmit={(e) => {
                    e.preventDefault()
                    console.log(sectionData)
                }}
                className="rounded-md bg-white"
            >
                <div className="flex grow items-center">
                    <span className="text-xl font-bold uppercase text-primary">
                        {section.name}
                    </span>
                    {section.description !== null
                        ? Helpers.map((x, i) => {
                              if (section.description === i)
                                  return (
                                      <div
                                          key={i}
                                          className="group relative hover:w-2/3"
                                      >
                                          <QuestionMark className="pointer-events-none ml-2 h-4 w-4 cursor-pointer text-primary transition-all duration-300 group-hover:scale-[1.4]" />

                                          <x.fn className="prose prose-sm prose-zinc absolute top-5 left-5 z-10 hidden bg-base-200 p-3 shadow-lg transition-all duration-200 group-hover:block prose-p:pl-6" />
                                      </div>
                                  )
                          })
                        : null}
                </div>
                <div className="mx-6 mt-5 max-w-[1120px]">
                    {sectionData.map((i: InputT) => (
                        <div key={i.title} className="m-3 p-1">
                            <p
                                className={`text-[0.6rem] font-thin uppercase transition duration-500  ${
                                    i.value
                                        ? 'opacity-100'
                                        : 'translate-y-1 opacity-0'
                                }`}
                            >
                                {i.title}
                            </p>
                            {renderInputData(i)}

                            {/* {(i.conditional || i.conditionalValues) && i.value
                                ? getConditionalValues(
                                      i.title,
                                      i.value,
                                      i.conditionalValues
                                  ).map((x: InputT) => {
                                      return (
                                          <div key={x.title} className="my-4">
                                              <p
                                                  className={`text-[0.6rem] font-thin uppercase transition duration-500  ${
                                                      x.value
                                                          ? 'opacity-100'
                                                          : 'translate-y-1 opacity-0'
                                                  }`}
                                              >
                                                  {x.title}
                                              </p>
                                              <pre>
                                                  {JSON.stringify(x, null, 2)}
                                              </pre>
                                              {renderInputData(x)}
                                          </div>
                                      )
                                  })
                                : null} */}
                        </div>
                    ))}
                </div>
            </form>
        </div>
    )
}
