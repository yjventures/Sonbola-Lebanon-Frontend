import React from 'react'
import { RiMenu2Line } from "react-icons/ri";
import { FaGlobe } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { IoIosNotifications } from "react-icons/io";
import { MdPerson } from "react-icons/md";
import { showToast } from '../../Common/Toastify/Toastify';

const AdminHeader = () => {
    return (
        <div className='bg-white w-full py-5 font-main flex justify-between items-start md:items-center flex-col md:flex-row gap-y-3 md:gap-y-0'>
            {/* left part of design */}
            <div className='flex justify-around items-center gap-3 '>
                {/* menu button */}
                <div className='w-[42px] h-[42px] bg-gray-100 flex justify-center items-center rounded-md cursor-pointer'
                    // on click event
                    onClick={() => {
                        showToast('Do something', 'info')
                    }}>
                    <RiMenu2Line className=' text-gray-600 ' />
                </div>

                {/* browse button */}
                <div className='flex bg-gray-100 justify-center gap-2 items-center rounded-md cursor-pointer px-[12px] py-[9px]'
                    // on click event
                    onClick={() => {
                        showToast('Do something', 'info')
                    }}>
                    <FaGlobe className=' text-gray-600 ' />
                    <p className='font-[600] text-[14px]'>Browse Website</p>
                </div>

                {/* Add new button */}
                <div className='flex bg-gray-100 justify-center gap-2 items-center rounded-md cursor-pointer px-[12px] py-[9px]'
                    // on click event
                    onClick={() => {
                        showToast('Do something', 'info')
                    }}>
                    <FaPlus className=' text-gray-600' />
                    <p className='font-[600] text-[14px]'>Add New</p>
                </div>
            </div>
            {/* right part of design */}
            <div className='flex items-center justify-center gap-3'>
                {/* search */}
                <input type="text" placeholder='Search for anything...' className='bg-gray-100 p-2 outline-none lg:block' />
                {/* notification */}
                <IoIosNotifications className='text-2xl text-gray-600 cursor-pointer' />
                {/* Profile */}
                <MdPerson className='text-2xl text-gray-600 cursor-pointer' />
            </div>

        </div>
    )
}

export default AdminHeader