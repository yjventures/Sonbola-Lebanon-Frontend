import React from 'react'
import gift from 'assets/global/motivation/gift.svg'
import review from 'assets/global/motivation/review.svg'
import service from 'assets/global/motivation/service.svg'

const Motivation = ({ length }) => {
    const motivation = [
        {
            title: 'Delivered to you',
            subTitle: 'information on its origins'
        },
        {
            title: 'Great Reviews',
            subTitle: 'information on its origins'
        },
        {
            title: 'Great Service',
            subTitle: 'information on its origins'
        },
        {
            title: 'Bulk orders',
            subTitle: 'information on its origins'
        }
    ]

    return (
        <div className={`grid grid-cols-${length === 4 ? 2 : 1} md:grid-cols-${length} gap-4 font-main`}>
            {motivation.slice(0, length).map((item, index) => (
                <div className="bg-primary-motivation rounded-lg shadow-sm flex items-center gap-2 border-[1px] border-[#D8E0E9] p-[24px]">
                    <div className='bg-[#FAF8F5] w-14 h-14 rounded-full flex items-center justify-center'>
                        <img src={index === 0 ? gift : index === 1 ? review : service} alt="icon" />
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold">{item.title}</h3>
                        <p className="text-sm text-gray-600">{item.subTitle}</p>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Motivation