import React from 'react'
import { FaCreditCard, FaSignOutAlt } from 'react-icons/fa';
import { FaRegHeart } from "react-icons/fa";
import { TfiHeadphoneAlt } from "react-icons/tfi";
import { FaRegUser } from "react-icons/fa6";
import { RiMapPin2Line } from "react-icons/ri";
import { PiShoppingBagOpenLight } from "react-icons/pi";
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';


const ProfileSidebar = () => {
    const navigate = useNavigate()
    // get current url path
    const path = window.location.pathname;
    const user  = JSON.parse(localStorage.getItem('user'))
    const token  = JSON.parse(localStorage.getItem('token'))
    // console.log(path)
    const { isPending, data, isError, error} = useQuery({
        queryKey: ['count'],
        queryFn: async () => {
            const response = await axios.get(`${import.meta.env.VITE_API_PATH}/customer-orders/get-infos?userId=${user._id}`, {
                headers: {
                    Authorization: `Bearer ${token.accessToken}`
                }
            })

            return response?.data?.info;
        }
    })

    // // console.log(data)
    // if(isPending) return 'Loading...'
    // if(isError) return 'An error occurred: ' + error

    return (
        <div className='h-[100%] min-h-[380px] lg:min-h-[600px] relative w-full lg:max-w-[240px] mx-auto font-main mt-2 lg:mt-0'
            style={{
                boxShadow: '0px 1px 3px 0px rgba(3, 0, 71, 0.09)',
            }}
        >
            <header className='text-[#7D879C] py-3 px-6 text-[12px]'>
                DASHBOARD
            </header>
            <ul className='space-y-1'>
                <li onClick={() => {
                    navigate('/orders')
                }}
                    className={`flex items-center justify-between py-2 px-6 text-gray-600 transition cursor-pointer hover:text-green-600 hover:border-l-4 hover:border-l-green-600 focus:text-green-600 focus:border-l-4 focus:border-l-green-600 ${path == '/orders' && 'text-green-600 border-l-4 border-l-green-600'}`}
                >
                    <p className='flex items-center'>
                        <PiShoppingBagOpenLight className='mr-2 w-[18px] h-[18px]' />
                        <span>Orders</span>
                    </p>
                    {/* 0 */}
                    {
                        data?.order_count
                    }
                </li>
                <li onClick={() => {
                    navigate('/wishlist')
                }}
                    className={`flex items-center justify-between py-2 px-6 text-gray-600 transition cursor-pointer hover:text-green-600 hover:border-l-4 hover:border-l-green-600 focus:text-green-600 focus:border-l-4 focus:border-l-green-600 ${path == '/wishlist' && 'text-green-600 border-l-4 border-l-green-600'}`}
                >
                    <p className='flex items-center'>
                        <FaRegHeart className='mr-2 w-[18px] h-[18px]' />
                        <span>Wishlist</span>
                    </p>
                    {
                        data?.wishlist_count
                    }
                </li>
                <li onClick={() => {
                    navigate('/support-tickets')
                }}
                    className={`flex items-center justify-between py-2 px-6 text-gray-600 transition cursor-pointer hover:text-green-600 hover:border-l-4 hover:border-l-green-600 focus:text-green-600 focus:border-l-4 focus:border-l-green-600 ${path == '/support-tickets' && 'text-green-600 border-l-4 border-l-green-600'}`}
                >
                    <p className='flex items-center'>
                        <TfiHeadphoneAlt className='mr-2 w-[18px] h-[18px]' />
                        <span>Support tickets</span>
                    </p>
                    0
                </li>
            </ul>
            <header className='text-[#7D879C] py-3 px-6 text-[12px]'>
                ACCOUNT SETTINGS
            </header>
            <ul className='space-y-1'>
                <li
                    onClick={() => {
                        navigate('/profile')
                    }}
                    className={`flex items-center justify-between py-2 px-6 text-gray-600 transition cursor-pointer hover:text-green-600 hover:border-l-4 hover:border-l-green-600 focus:text-green-600 focus:border-l-4 focus:border-l-green-600 ${path == '/profile' && 'text-green-600 border-l-4 border-l-green-600'}`}
                >
                    <p className='flex items-center'>
                        <FaRegUser className='mr-2 w-[18px] h-[18px]' />
                        <span>Profile</span>
                    </p>
                </li>
                <li onClick={() => {
                    navigate('/address')
                }}
                    className={`flex items-center justify-between py-2 px-6 text-gray-600 transition cursor-pointer hover:text-green-600 hover:border-l-4 hover:border-l-green-600 focus:text-green-600 focus:border-l-4 focus:border-l-green-600 ${path == '/address' && 'text-green-600 border-l-4 border-l-green-600'}`}
                >
                    <p className='flex items-center'>
                        <RiMapPin2Line className='mr-2 w-[18px] h-[18px]' />
                        <span>Addresses</span>
                    </p>
                    {/* 0 */}
                </li>
                <li onClick={() => {
                    navigate('/payment-methods')
                }}
                    className={`flex items-center justify-between py-2 px-6 text-gray-600 transition cursor-pointer hover:text-green-600 hover:border-l-4 hover:border-l-green-600 focus:text-green-600 focus:border-l-4 focus:border-l-green-600 ${path == '/payment-methods' && 'text-green-600 border-l-4 border-l-green-600'}`}
                >
                    <p className='flex items-center'>
                        <FaCreditCard className='mr-2 w-[18px] h-[18px]' />
                        <span>Payment methods</span>
                    </p>
                    {/* 0 */}
                </li>
            </ul>
            <button
                onClick={() => {
                    localStorage.clear()
                    navigate('/signin')
                }}
                className='hidden absolute bottom-5 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-600 w-[100%] max-w-[105px] h-[44px] rounded-md text-primary-text-color lg:flex justify-center items-center'>
                Log out
                <FaSignOutAlt className='ml-1 mt-[2px]' />
            </button>
        </div>
    );
}

export default ProfileSidebar