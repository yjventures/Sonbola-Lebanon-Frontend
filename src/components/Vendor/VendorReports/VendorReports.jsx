import React from 'react'
import { IoMdArrowDropup } from "react-icons/io";
import Circle1 from 'assets/vendor/circle1.svg'
import Shipped from 'assets/vendor/shipped.svg'
import Delivered from 'assets/vendor/delivered.svg'
import Cancel from 'assets/vendor/cancel.svg'

const VendorReports = () => {
    return (
        <div className='grid sm:grid-cols-2 md:grid-cols-4 gap-2'>
            <div className='border-2 border-[#eeeff2] rounded-md relative p-4'>
                <p className='text-[#777980] font-[12px]'>
                    Processing
                </p>
                <p className='font-[600] my-2 text-[22px]'>
                    1,201
                </p>
                <div className='flex gap-2 text-[12px]'>
                    <p className='text-green-600 font-[700] flex items-center'>
                        10%
                        <IoMdArrowDropup />
                    </p>
                    <p className='font-[600] text-gray-500'>
                        +120 today
                    </p>
                </div>
                <img src={Circle1} alt="icon" className='absolute top-2 right-3' />
            </div>
            <div className='border-2 border-[#eeeff2] rounded-[5px] relative p-4'>
                <p className='text-[#777980] font-[12px]'>
                    Shiped
                </p>
                <p className='font-[600] my-2 text-[22px]'>
                    1,821
                </p>
                <div className='flex gap-2 text-[12px]'>
                    <p className='text-green-600 font-[700] flex items-center'>
                        10%
                        <IoMdArrowDropup />
                    </p>
                    <p className='font-[600] text-gray-500'>
                        +120 today
                    </p>
                </div>
                <img src={Shipped} alt="icon" className='absolute top-2 right-3' />
            </div>
            <div className='border-2 border-[#eeeff2] rounded-[5px] relative p-4'>
                <p className='text-[#777980] font-[12px]'>
                    Delivered
                </p>
                <p className='font-[600] my-2 text-[22px]'>
                    9,100
                </p>
                <div className='flex gap-2 text-[12px]'>
                    <p className='text-green-600 font-[700] flex items-center'>
                        10%
                        <IoMdArrowDropup />
                    </p>
                    <p className='font-[600] text-gray-500'>
                        +912 today
                    </p>
                </div>
                <img src={Delivered} alt="icon" className='absolute top-2 right-3' />
            </div>
            <div className='border-2 border-[#eeeff2] rounded-[5px] relative p-4'>
                <p className='text-[#777980] font-[12px]'>
                    Canceled
                </p>
                <p className='font-[600] my-2 text-[22px]'>
                    140
                </p>
                <div className='flex gap-2 text-[12px]'>
                    <p className='text-green-600 font-[700] flex items-center'>
                        10%
                        <IoMdArrowDropup />
                    </p>
                    <p className='font-[600] text-gray-500'>
                        +14 today
                    </p>
                </div>
                <img src={Cancel} alt="icon" className='absolute top-2 right-3' />
            </div>

        </div>
    )
}

export default VendorReports