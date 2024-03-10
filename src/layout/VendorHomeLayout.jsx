import React from 'react'
import { Outlet } from 'react-router-dom'
import NewsLetter from 'src/components/Common/NewsLetter/NewsLetter'
import Footer from 'src/components/Footer/Footer'
import VendorHomeHeader from 'src/components/Vendor/VendorHomeHeader/VendorHomeHeader'

const VendorHomeLayout = () => {
    return (
        <>
            <VendorHomeHeader />
            <Outlet />
            <NewsLetter />
            <Footer />
        </>
    )
}

export default VendorHomeLayout