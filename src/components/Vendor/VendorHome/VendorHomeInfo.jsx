import React from 'react'

const VendorHomeInfo = () => {

    const data = [
        {
            title: 'products',
            amount: '200M+'
        },
        {
            title: 'suppliers',
            amount: '200k+'
        },
        {
            title: 'product categories',
            amount: '5,900'
        },
        {
            title: 'countries and regions',
            amount: '200+'
        }
    ]


    return (
        <div className='my-[75px] grid grid-cols-1 md:grid-cols-2 font-main gap-4'>
            <div className='font-teko text-[40px] md:text-[80px] font-[700]'
                style={{
                    lineHeight: '72px'
                }}
            >
                <p>Join sonbola and start selling your products now!</p>
            </div>
            <div className="grid grid-cols-2 gap-2">

                {data.map((item, index) => (
                    <div key={index} className='border-l-4 h-[80px] ps-3 pt-1'>
                        <h2 className="text-4xl font-semibold text-green-600">{item.amount}</h2>
                        <p className="text-lg text-gray-700">{item.title}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default VendorHomeInfo