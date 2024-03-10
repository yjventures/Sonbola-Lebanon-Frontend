import React from 'react'
import { Outlet } from 'react-router-dom'
import VendorSidebar from '../components/Vendor/VendorSidebar/VendorSidebar'

const VendorLayout = () => {
    return (
        <div className='max-w-7xl mx-auto py-10 px-3'>
            <div className='lg:grid lg:grid-cols-3'>
                <div className='hidden lg:block'>
                    <VendorSidebar />
                </div>
                <div className='col-span-2 lg:col-span-0'>
                    <Outlet />
                </div>
            </div>
        </div>
    )
}

export default VendorLayout