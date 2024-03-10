import React from 'react'
import { FaArrowRightLong } from 'react-icons/fa6'
import { Link, useNavigate } from 'react-router-dom'
import icon from 'assets/global/sonbola.svg'
import textIcon from 'assets/constant/logo/textSonbolaBlack.svg'
import { MdOutlineKeyboardArrowDown } from "react-icons/md";


const VendorHomeHeader = () => {
    const navigate = useNavigate();

    return (
        <div className='py-5 font-main bg-[#FFFFFF] w-full'>
            <div className='max-w-7xl mx-auto w-full flex justify-between items-center '>
                <div className="flex ">
                    <Link to="/vendor-home" className="-m-1.5 p-1.5 flex gap-2">
                        <span className="sr-only">Sonbola</span>
                        <img src={icon} alt="icon" className='h-8 w-auto' />
                        <img src={textIcon} alt="sonbola" className='h-8 w-24 md:w-28 lg:w-32' />
                    </Link>
                </div>


                {/* discount place */}
                <div className='flex justify-between items-center gap-3'>
                    <div className='flex items-center gap-1 cursor-pointer'>
                        <p>Platform</p>
                        <MdOutlineKeyboardArrowDown className='text-gray-500' />
                    </div>
                    <div className='flex items-center gap-1 cursor-pointer'>
                        <p>Solutions</p>
                        <MdOutlineKeyboardArrowDown className='text-gray-500' />
                    </div>
                    <div className='flex items-center gap-1 cursor-pointer'>
                        <p>Pricing</p>
                        <MdOutlineKeyboardArrowDown className='text-gray-500' />
                    </div>
                </div>

                {/* shop now button */}
                <div className='flex gap-2'>
                    <div className='hidden lg:block'>
                        <button
                            onClick={() => navigate('/vendor-signin?type=vendor')}
                            className='bg-[#319848] text-primary-text-color text-[12px] font-[700] px-4 py-2 uppercase flex items-center gap-2 '>
                            Sign in
                        </button>
                    </div>
                    <div className='hidden lg:block'>

                        <button
                            onClick={() => navigate('/vendor-signup?type=vendor')}
                            className='bg-[#319848] text-primary-text-color text-[12px] font-[700] px-4 py-2 uppercase flex items-center gap-2 '>
                            Start Selling
                        </button>
                    </div>
                </div>

            </div>

        </div>
    )
}

export default VendorHomeHeader