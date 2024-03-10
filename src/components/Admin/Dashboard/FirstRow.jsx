import React from 'react'
import greeting from 'assets/admin/dashboard/greeting.png'
import { IoMdArrowDropup } from "react-icons/io";
import { MdArrowDropDown } from "react-icons/md";

export default function FirstRow() {
    const data = [
        {
            'type': 'Order',
            'number': '32,350',
            'amount': '9,320',
            'percentage': '25.25%'
        },
        {
            'type': 'Sold Items',
            'number': '32,350',
            'amount': '9,320',
            'percentage': '25.25%'
        },
        {
            'type': 'Gross Sale',
            'number': '32,350',
            'amount': '9,320',
            'percentage': '-25.25%'
        },
        {
            'type': 'Total Shipping Cost',
            'number': '32,350',
            'amount': '9,320',
            'percentage': '-12.25%'
        },
    ]
    const ItemsInfo = ({ item }) => {
        return (
            <div className='w-full bg-white p-4 rounded-sm'>
                <p className='text-gray-500'> {item.type}</p>
                <p className='text-[24px] my-2'>
                    {item.number}
                </p>
                <div className='flex justify-between items-center'>
                    <p>$ {item.amount}</p>
                    <p className={parseFloat(item.percentage) > 0 ? `flex items-center gap-2 text-green-600` : `flex items-center gap-2 text-red-600`}> {parseFloat(item.percentage) > 0 ? <IoMdArrowDropup className=' h-5 w-5' /> : <MdArrowDropDown className='h-5 w-5' />} {item.percentage}</p>
                </div>
            </div>
        )
    }

    return (
        <div className='grid grid-cols-2 my-4 gap-4'>
            {/* greeting stuff */}
            <div className='grid grid-cols-12 bg-primary-color px-6 py-6 rounded-md'>
                <div className='col-span-8'>
                    <p className='text-[#1A985B] text-[18px]'>Good Morning Mahi!</p>
                    <p className='text-[14px] text-gray-400 mb-6'>Here’s what happening with your store today!</p>
                    <div className='my-3'>
                        <p className='text-[24px] text-secondary-color'>
                            $15,350.25
                        </p>
                        <p className='text-[14px] text-gray-400'>
                            Today’s Visit
                        </p>
                    </div>
                    <div className='mt-6'>
                        <p className='text-[24px] text-secondary-color'>
                            $10,360.66
                        </p>
                        <p className='text-[14px] text-gray-400'>
                            Today’s total sales
                        </p>
                    </div>
                </div>
                <div className='col-span-4 flex justify-center items-center'>
                    <img src={greeting} alt="greeting-image" />
                </div>
            </div>
            {/* items details */}
            <div className='grid grid-cols-2 gap-4 rounded-md'>
                {
                    data.map((item, index) => <ItemsInfo item={item} key={index} />)
                }
            </div>
        </div>
    )
}
