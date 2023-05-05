import React from 'react'
import { Checkbox } from '@mantine/core'

const ReviewScientificInstructions = () => {
    return (
        <div className="mt-2 flex flex-col space-x-4 rounded bg-gray-100 p-4 text-gray-500">
            {/* <dl>
                    <dt className="label">Instrucciones de evaluación</dt>
                    <dd className="text-sm font-light text-gray-600">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Similique labore perferendis optio qui. Iusto tenetur,
                        eos, accusamus a placeat aspernatur itaque magni fuga
                        incidunt id optio non officiis repudiandae perspiciatis!
                    </dd>
                </dl> */}
            <ul data-type="taskList">
                <li data-type="taskItem" data-checked="true">
                    A list item
                </li>
                <li data-type="taskItem" data-checked="false">
                    And another one
                </li>
            </ul>
        </div>
    )
}

export default ReviewScientificInstructions
