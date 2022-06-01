import React from 'react'
import ItemView from '../components/Atomic/ProtocolItemView'

export default function projects() {
    const content = [
        {
            title: 'Lorem ipsum dolor sit amet',
            description:
                'Consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
        },
        {
            title: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat ',
            description:
                'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        },
        {
            title: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem',
            description:
                'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur',
        },
        {
            title: 'At vero eos et accusamus et iusto',
            description:
                'Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.',
        },
        {
            title: 'Phasellus eu orci ut metus vulputate condimentum. Integer nisi neque, euismod ac auctor vitae, feugiat et erat.',
            description:
                'In hendrerit arcu eget elit laoreet viverra. Phasellus placerat ac arcu sit amet gravida. Sed vehicula ullamcorper lobortis. Etiam ullamcorper metus blandit magna sollicitudin fermentum vel vel ligula. Nullam porttitor nulla dictum ornare molestie. Duis accumsan elit sed urna viverra, ut iaculis mauris feugiat. Nulla et eleifend ligula. In sit amet luctus massa, in blandit erat. Suspendisse est nisi, tempor et consectetur vitae, condimentum ac sapien. Curabitur at dui elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sollicitudin lorem ipsum, porttitor interdum ipsum gravida eu. Suspendisse quis odio ut dui ullamcorper egestas in nec nisi.',
        },

        {
            title: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat ',
            description:
                'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.',
        },
        {
            title: 'Sed ut perspiciatis unde omnis iste natus error sit voluptatem',
            description:
                'Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet, consectetur',
        },
        {
            title: 'At vero eos et accusamus et iusto',
            description:
                'Itaque earum rerum hic tenetur a sapiente delectus, ut aut reiciendis voluptatibus maiores alias consequatur aut perferendis doloribus asperiores repellat.',
        },
        {
            title: 'Phasellus eu orci ut metus vulputate condimentum. Integer nisi neque, euismod ac auctor vitae, feugiat et erat.',
            description:
                'In hendrerit arcu eget elit laoreet viverra. Phasellus placerat ac arcu sit amet gravida. Sed vehicula ullamcorper lobortis. Etiam ullamcorper metus blandit magna sollicitudin fermentum vel vel ligula. Nullam porttitor nulla dictum ornare molestie. Duis accumsan elit sed urna viverra, ut iaculis mauris feugiat. Nulla et eleifend ligula. In sit amet luctus massa, in blandit erat. Suspendisse est nisi, tempor et consectetur vitae, condimentum ac sapien. Curabitur at dui elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sollicitudin lorem ipsum, porttitor interdum ipsum gravida eu. Suspendisse quis odio ut dui ullamcorper egestas in nec nisi.',
        },
    ]
    return (
        <div className="transition-all duration-200">
            <div className="mx-auto mb-20 flex w-[1280px] flex-col justify-center px-20 py-10">
                {content.map((item) => (
                    <div className="mt-5">
                        <ItemView
                            title={item.title}
                            description={item.description}
                        ></ItemView>
                    </div>
                ))}
            </div>
        </div>
    )
}
