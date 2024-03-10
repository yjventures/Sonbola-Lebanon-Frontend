import React from 'react'
import { FaArrowRightLong } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';

const EventHeader = () => {
    const navigate = useNavigate();

    return (
        <div className='p-3 font-main bg-header-background w-full'>
            <div className='max-w-7xl mx-auto w-full flex justify-between items-center '>
                <div className='flex items-center justify-center '>
                    <h1
                        className='text-[12px] lg:text-[18px] font-[600] text-primary-text-color bg-buttons py-2 px-3'
                        style={{ rotate: '-7deg', }}
                    >
                        Hambaa
                    </h1>
                    <h1 className='text-[12px] lg:text-[18px] font-[600] text-primary-text-color py-2 px-3'>Mubarak</h1>
                </div>

                {/* discount place */}
                <div className='text-primary-text-color flex items-center lg:gap-2 gap-1 '>
                    <h1 className='text-[8px] lg:text-[18px] '>up to</h1>
                    <h1 className='text-[18px] lg:text-[36px] font-bold text-buttons'>59%</h1>
                    <h1 className='text-[12px] lg:text-[18px] font-bold'>OFF</h1>
                </div>

                {/* shop now button */}
                <div className='hidden lg:block'>
                    <button
                        onClick={() => {
                            navigate('product-catalog')
                        }}
                        className='bg-buttons text-primary-text-color text-[12px] font-[700] px-4 py-2 uppercase flex items-center gap-2 transition '>
                        Shop Now
                        <FaArrowRightLong className='text-dark' />
                    </button>
                </div>

            </div>

        </div>
    )
}

export default EventHeader