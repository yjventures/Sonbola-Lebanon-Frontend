import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { useLayoutEffect, useRef, useState } from 'react'
import { BsThreeDotsVertical } from "react-icons/bs";


function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
}

export default function ThirdRow() {
    const checkbox = useRef()
    const [checked, setChecked] = useState(false)
    const [indeterminate, setIndeterminate] = useState(false)
    const [selectedPeople, setSelectedPeople] = useState([])

    function toggleAll() {
        // setSelectedPeople(checked || indeterminate ? [] : people)
        setChecked(!checked && !indeterminate)
        setIndeterminate(false)
    }

    const [limit, setLimit] = useState(10)

    const { isPending, isError, error, data: orders } = useQuery({
        queryKey: ['recent_purchase1', limit], //, limit, page
        queryFn: async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_PATH}/customer-orders/get-all`, {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
                    }
                });

                const jsonData = await response.json();
                // setTotalPages(Math.ceil(jsonData?.total / limit))
                return jsonData.orders;
            } catch (error) {
                throw new Error(`Error fetching users: ${error.message}`);
            }
        },
    });

    console.log(orders, isPending, isError)
    return (
        <div className='grid grid-cols-12 gap-4'>
            <div className='col-span-8 bg-white p-4 rounded-md'>
                <div className="mt-8 flow-root">
                    <p className='mb-4'>Recent Purchases</p>
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <div className="relative">

                                <table className="min-w-full table-fixed divide-y divide-gray-300">
                                    <thead className='bg-gray-200'>
                                        <tr>
                                            <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
                                                <input
                                                    type="checkbox"
                                                    className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                    ref={checkbox}
                                                    checked={checked}
                                                    onChange={toggleAll}
                                                />
                                            </th>
                                            <th scope="col" className="min-w-[12rem] py-3.5 pr-3 text-left text-sm font-semibold text-gray-900">
                                                Order ID
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Product
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Payment
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Amount
                                            </th>
                                            <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-3">
                                                <span className="sr-only">Edit</span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white">
                                        {orders?.map((order) => (
                                            <tr key={order?._id} > { /* className={selectedPeople.includes(order) ? 'bg-gray-50' : undefined} */}
                                                <td className="relative px-7 sm:w-12 sm:px-6">
                                                    <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />
                                                    <input
                                                        type="checkbox"
                                                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                        value={order?._id}
                                                        // checked={selectedPeople.includes(order)}
                                                        onChange={(e) => { }}
                                                    />
                                                </td>
                                                <td
                                                    className={`whitespace-nowrap py-4 pr-3 text-sm font-medium`}
                                                >
                                                    {order._id}
                                                </td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.items[0]?.name.en.length > 40 ? order.items[0]?.name.en.slice(0, 40) + '...' : order.items[0]?.name.en}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.payment_method}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.total_price}</td>
                                                <td className="whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-3 ">
                                                    <BsThreeDotsVertical className='cursor-pointer' />
                                                    <span className="sr-only">, {order.user_id}</span>
                                                </td>
                                            </tr>
                                        ))}

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='col-span-4 bg-white p-4 rounded-md overflow-hidden'>
                <div className="mt-8 flow-root">
                    <p className='mb-4'>Stock out product </p>
                    <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                            <div className="relative">
                                <table className="min-w-full table-fixed divide-y divide-gray-300">
                                    <thead className='bg-gray-200'>
                                        <tr>
                                            <th scope="col" className="relative px-7 sm:w-12 sm:px-6">
                                                <input
                                                    type="checkbox"
                                                    className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                    ref={checkbox}
                                                    checked={checked}
                                                    onChange={toggleAll}
                                                />
                                            </th>
                                            <th scope="col" className="min-w-[12rem] py-3.5 pr-3 text-left text-sm font-semibold text-gray-900">
                                                Product Name
                                            </th>
                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Stock
                                            </th>

                                            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                                Amount
                                            </th>

                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200 bg-white ">
                                        {orders?.map((order) => (
                                            <tr key={order?._id} > { /* className={selectedPeople.includes(order) ? 'bg-gray-50' : undefined} */}
                                                <td className="relative px-7 sm:w-12 sm:px-6">
                                                    <div className="absolute inset-y-0 left-0 w-0.5 bg-indigo-600" />
                                                    <input
                                                        type="checkbox"
                                                        className="absolute left-4 top-1/2 -mt-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                                        value={order?._id}
                                                        // checked={selectedPeople.includes(order)}
                                                        onChange={(e) => { }}
                                                    />
                                                </td>
                                                
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.items[0]?.name.en.length > 40 ? order.items[0]?.name.en.slice(0, 40) + '...' : order.items[0]?.name.en}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.payment_method}</td>
                                                <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">{order.total_price}</td>
                                               
                                            </tr>
                                        ))}

                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
