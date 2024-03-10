import React from 'react'
import AdminSidebar from '../components/Admin/AdminSIdebar/AdminSidebar'
import { Outlet } from 'react-router-dom'
import AdminHeader from '../components/Admin/AdminHeader/AdminHeader'

const AdminLayout = () => {
    return (
        <div className='max-w-12xl flex justify-start'>
            <div className='hidden lg:block'>
                <AdminSidebar />
            </div>
            <div className='p-3 w-full'>
                <AdminHeader />
                <Outlet />
            </div>
        </div>
    )
}

export default AdminLayout