import React from 'react'
import { IoReorderThreeOutline } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import VendorSidebar from '../VendorSidebar/VendorSidebar'

const VendorHeader = ({ icon, text, link, buttonText }) => {
    const [showSidebar, setShowSidebar] = React.useState(false)
    const navigate = useNavigate()

    return (
        <div className='lg:flex justify-between items-center relative'>
            <div className='flex items-center'>
                {icon && <img src={icon} alt="icon" />}

                <p className={`text-xl ms-2 ${icon ? 'font-bold' : 'font-medium'}`}>{text}</p>
            </div>
            <div className='lg:hidden absolute top-0 right-2'>
                <IoReorderThreeOutline className='w-[20px] h-[20px]' onClick={() => {
                    setShowSidebar(!showSidebar)
                }} />
            </div>
            <div className='lg:hidden'>
                {
                    showSidebar && <VendorSidebar />
                }
            </div>
            {
                link && <button
                    onClick={() => {
                        navigate(link)
                    }}
                    className='border-2 px-[20px] py-[6px] text-[16px] font-[600] text-primary-text-color bg-[#1A985B] transition my-4 lg:mt-0 rounded-md'>
                    {buttonText}
                </button>
            }

        </div>
    )
}

export default VendorHeader