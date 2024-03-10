import React, { useEffect, useRef } from 'react'
import cartIcon from '../../../assets/vendor/cart-fill.svg'
import { IoReorderThreeOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import { useAtomValue } from 'jotai';
import { userAtom } from '../../../lib/jotai';
import VendorSidebar from '../../../components/Vendor/VendorSidebar/VendorSidebar';
import VendorDashboardInfo from '../../../components/Vendor/VendorDashboard/VendorDashboardInfo';
import { showToast } from '../../../components/Common/Toastify/Toastify';
import VendorHeader from '../../../components/Vendor/VendorHeader/VendorHeader';


const VendorDashboard = () => {
    const navigate = useNavigate()
    const user = useAtomValue(userAtom)
    const initialized = useRef(false)
    // console.log(user)
    // console.log(user?.vendor_info?.shop)
    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true
            if (user?.vendor_info?.shop === false || user?.vendor_info?.shop === undefined) {
                navigate('/shop-settings')
                showToast('Please complete your shop settings page', 'info')
            }
        }
    }, [])

    return (
        <div className='h-full p-3 font-main lg:-ms-10'>
            {/* upper side text and nav */}
            {/* <div className='lg:flex justify-between items-center relative'>
                <div className='flex items-center'>
                    <img src={cartIcon} alt="icon" />
                    <p className='text-xl font-bold ms-2'>Dashboard</p>
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

                <button
                    onClick={() => {
                        navigate('/vendor-edit-profile')
                    }}
                    className='border-2 px-[20px] py-[6px] text-[16px] font-[600] text-primary-text-color bg-[#1A985B] transition my-4 lg:mt-0 rounded-md'>Edit Profile
                </button>
            </div> */}
            <VendorHeader icon={cartIcon} text='Dashboard' link='/vendor-edit-profile' buttonText='Edit Profile' />
            {/* info component */}
            <VendorDashboardInfo />
        </div>
    )
}

export default VendorDashboard