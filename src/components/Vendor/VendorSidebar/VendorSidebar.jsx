import React from 'react'
import { FaSignOutAlt } from 'react-icons/fa';
import { TfiHeadphoneAlt } from "react-icons/tfi";
import { PiShoppingBagOpenLight } from "react-icons/pi";
import { useNavigate } from 'react-router-dom';
import { BsLayoutThreeColumns } from "react-icons/bs";
import { LuUpload } from "react-icons/lu";
import { FiShoppingCart } from "react-icons/fi";
import { IoSettings } from "react-icons/io5";
import { atomWithStorage, RESET } from 'jotai/utils'
import { useAtom, useSetAtom } from 'jotai';
import { newProductAtom } from 'src/lib/jotai';
import { useQuery } from '@tanstack/react-query';

const VendorSidebar = () => {
    const navigate = useNavigate()
    const newProduct = useSetAtom(newProductAtom)
    // get current url path
    const path = window.location.pathname;
    // console.log(path)
    const { isPending, isError, error, data } = useQuery({
        queryKey: ['products'],
        queryFn: async () => {
            try {
                // const response = await fetch(`${import.meta.env.VITE_API_PATH}/users/get-all?is_approved=${is_approved}&type=vendor`, {
                const response = await fetch(`${import.meta.env.VITE_API_PATH}/products/get-all?shop=${JSON.parse(localStorage.getItem('shop'))._id}`, {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
                    }
                });

                const jsonData = await response.json();
                return jsonData?.total
            } catch (error) {
                throw new Error(`Error fetching users: ${error.message}`);
            }
        },
    });
    // console.log(data.length)
    return (
        <div className='h-[100%] min-h-[380px] lg:min-h-[530px] relative w-full lg:max-w-[240px] mx-auto font-main mt-2 lg:mt-0'
            style={{
                boxShadow: '0px 1px 3px 0px rgba(3, 0, 71, 0.09)',
            }}
        >

            <ul className='space-y-1'>
                <li onClick={() => {
                    navigate('/vendor-dashboard')
                }}
                    className={`flex items-center justify-between py-2 px-6 text-gray-600 transition cursor-pointer hover:text-green-600 hover:border-l-4 hover:border-l-green-600 focus:text-green-600 focus:border-l-4 focus:border-l-green-600 ${path == '/vendor-dashboard' && 'text-green-600 border-l-4 border-l-green-600'}`}
                >
                    <p className='flex items-center'>
                        <BsLayoutThreeColumns className='mr-2 w-[18px] h-[18px]' />
                        <span>Dashboard</span>
                    </p>
                </li>
                <li onClick={() => {
                    navigate('/vendor-products')
                }}
                    className={`flex items-center justify-between py-2 px-6 text-gray-600 transition cursor-pointer hover:text-green-600 hover:border-l-4 hover:border-l-green-600 focus:text-green-600 focus:border-l-4 focus:border-l-green-600 ${path == '/vendor-products' && 'text-green-600 border-l-4 border-l-green-600'}`}
                >
                    <p className='flex items-center'>
                        <PiShoppingBagOpenLight className='mr-2 w-[18px] h-[18px]' />
                        <span>Products</span>
                    </p>
                    {/* total products */}
                    {data}
                </li>
                <li onClick={() => {
                    newProduct({})
                    navigate('/new-product')
                }}
                    className={`flex items-center justify-between py-2 px-6 text-gray-600 transition cursor-pointer hover:text-green-600 hover:border-l-4 hover:border-l-green-600 focus:text-green-600 focus:border-l-4 focus:border-l-green-600 ${path == '/new-product' && 'text-green-600 border-l-4 border-l-green-600'}`}
                >
                    <p className='flex items-center'>
                        <LuUpload className='mr-2 w-[18px] h-[18px]' />
                        <span>Add New Product</span>
                    </p>
                </li>
                <li onClick={() => {
                    navigate('/vendor-orders')
                }}
                    className={`flex items-center justify-between py-2 px-6 text-gray-600 transition cursor-pointer hover:text-green-600 hover:border-l-4 hover:border-l-green-600 focus:text-green-600 focus:border-l-4 focus:border-l-green-600 ${path == '/vendor-orders' && 'text-green-600 border-l-4 border-l-green-600'}`}
                >
                    <p className='flex items-center'>
                        <FiShoppingCart className='mr-2 w-[18px] h-[18px]' />
                        <span>Orders</span>
                    </p>
                </li>
                <li onClick={() => {
                    navigate('/shop-settings')
                }}
                    className={`flex items-center justify-between py-2 px-6 text-gray-600 transition cursor-pointer hover:text-green-600 hover:border-l-4 hover:border-l-green-600 focus:text-green-600 focus:border-l-4 focus:border-l-green-600 ${path == '/vendor-settings' && 'text-green-600 border-l-4 border-l-green-600'}`}
                >
                    <p className='flex items-center'>
                        <IoSettings className='mr-2 w-[18px] h-[18px]' />
                        <span>Account Settings</span>
                    </p>
                </li>
            </ul>

            <button onClick={() => {
                localStorage.clear()
                navigate('/signin?type=vendor')
            }} className='hidden absolute bottom-5 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-green-600 w-[100%] max-w-[105px] h-[44px] rounded-md text-primary-text-color lg:flex justify-center items-center'>
                Log out
                <FaSignOutAlt className='ml-1 mt-[2px]' />
            </button>
        </div>
    );
}

export default VendorSidebar