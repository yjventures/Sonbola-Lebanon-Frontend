import React from 'react'
import Header from '../components/Header/Header'
import { Outlet } from 'react-router-dom'
import Footer from '../components/Footer/Footer'
import DownHeader from '../components/Header/DownHeader'
import EventHeader from '../components/Header/EventHeader'
import VendorHomeHeader from 'src/components/Vendor/VendorHomeHeader/VendorHomeHeader'
import { useLocation } from 'react-router-dom';

const UserLayout = () => {
    const location = useLocation();
    const path = location.pathname;
    
    return (
        <div className='bg-primary-color'>
            {
                (path.includes('vendor-home') || path.includes('vendor-signin') || path.includes('vendor-signup'))  ?
                    <VendorHomeHeader /> :
                    <>
                        <EventHeader />
                        <Header />
                        <DownHeader />
                    </>
            }
            <p className='w-[100%] h-[1px] bg-gray-100'></p>
            <Outlet />
            <Footer />
        </div>
    )
}
export default UserLayout