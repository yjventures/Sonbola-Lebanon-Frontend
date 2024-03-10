import React, { useEffect, useState } from 'react'
import { IoMdSearch } from "react-icons/io";
import { FaPlus } from "react-icons/fa6";
import eye from '../../../assets/admin/eye.svg'
import deleteIcon from '../../../assets/admin/delete.svg'
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAtomValue, useSetAtom } from 'jotai';
import { tokenAtom, viewVendorAtom } from '../../../lib/jotai';
import { MdOutlineRemoveRedEye } from "react-icons/md";
import { AiFillDelete } from "react-icons/ai";
import { parse } from 'postcss';
import { useNavigate } from 'react-router-dom';
import { showToast } from '../../../components/Common/Toastify/Toastify';
import PaginationComponent from '../../../components/Admin/Pagination/PaginationComponent';
import { RxAvatar } from "react-icons/rx";
import { TbListDetails } from "react-icons/tb";

const RefundList = () => {
    const token = useAtomValue(tokenAtom)
    const setViewVendor = useSetAtom(viewVendorAtom)
    // console.log(token)
    const navigate = useNavigate()
    const queryClient = useQueryClient()
    // console.log(JSON.parse(localStorage.getItem('token')).accessToken)
    const [is_verified, setIs_verified] = useState(false)
    const [limit, setLimit] = useState(10)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(0)
    const [search, setSearch] = useState('')

    // Function to handle page change
    const handlePageChange = (pageNumber) => {
        setPage(pageNumber);
    };


    // const { isPending, isError, error, data } = useQuery({
    //     queryKey: ['users', { is_verified, page, limit }],
    //     queryFn: async () => {
    //         try {
    //             // const response = await fetch(`${import.meta.env.VITE_API_PATH}/users/get-all?is_approved=${is_approved}&type=vendor`, {
    //             const response = await fetch(`${import.meta.env.VITE_API_PATH}/users/get-all?type=customer&page=${page}&limit=${limit}&is_verified=${is_verified}`, {
    //                 headers: {
    //                     Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
    //                 }
    //             });

    //             const jsonData = await response.json();
    //             return jsonData.users; // Access the 'users' array directly
    //         } catch (error) {
    //             throw new Error(`Error fetching users: ${error.message}`);
    //         }
    //     },
    // });

    const { isPending, isError, error, data } = useQuery({
        queryKey: ['refunds', { page, limit }],
        queryFn: async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_PATH}/refunds/get-all?page=${page}&limit=${limit}`, {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
                    }
                });

                const jsonData = await response.json();
                return jsonData.refunds; // Access the 'users' array directly
            } catch (error) {
                throw new Error(`Error fetching users: ${error.message}`);
            }
        },
    });
    // set total pages
    useEffect(() => {
        setTotalPages(Math.ceil(data?.length / limit))
    }, [data])

    // if (isPending) return <p>Loading...</p>
    // if (isError) return <p>{error}</p>
    console.log(data)
    const handleDeleteVendor = (id) => async () => {
        console.log(id)
        const response = await axios.delete(`${import.meta.env.VITE_API_PATH}/users/delete/${id}`, {
            headers: {
                Authorization: `Bearer ${token.accessToken}`
            }
        })
        console.log(response)
        if (response.status == 200) {
            showToast('Vendor deleted successfully', 'success')
            queryClient.invalidateQueries('users')
        } else {
            showToast('Something went wrong, Please try again', 'error')
        }
    }


    function classNames(...classes) {
        return classes.filter(Boolean).join(' ')
    }

    // pagination
    console.log(search)

    return (
        <div className='bg-gray-100 p-4 rounded-md'>
            <p className='font-[600]'>Refund Requests</p>

            <div className="sm:px-6 lg:px-1 ">
                <div className="-mx-4 mt-10 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg bg-white">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead>
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                                    Order Number
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Shop Name
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Product Details
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Amount
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Status
                                </th>
                                <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.map((refund) => (
                                <tr key={refund._id}>
                                    <td
                                        className="py-4 pl-4 pr-3 text-sm sm:pl-6 cursor-pointer"
                                        onClick={() => {
                                            navigator.clipboard.writeText(refund.order._id);
                                            showToast('Copied to clipboard', 'info')
                                        }}
                                    >
                                        #{refund.order._id}
                                    </td>
                                    <td className="px-3 py-3.5 text-sm text-gray-500">
                                        {refund.shop.name.en}
                                    </td>
                                    <td className="px-3 py-3.5 text-sm text-gray-500">
                                        <div className="flex items-center gap-2">
                                            <img src={refund.product_item.image} alt="Product" className="w-10 h-10 rounded-full" />
                                            {refund.product_item.name.en}
                                        </div>
                                    </td>
                                    <td className="px-3 py-3.5 text-sm text-gray-500">
                                        ${refund.amount}
                                    </td>
                                    <td className="px-3 py-3.5 text-sm text-gray-500">
                                        {refund.status}
                                    </td>
                                    <td className="py-3.5 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 flex justify-center items-center gap-2">
                                        {/* Example action: Delete (You can customize as needed) */}
                                        <TbListDetails
                                            onClick={() => {
                                                showToast('Show refund details - ongoing', 'info')
                                            }}
                                            className='cursor-pointer w-5 h-5 hover:text-green-600 transition mt-3'
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {/* Pagination remains unchanged */}
                    <PaginationComponent
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            </div>
        </div>
    )
}

export default RefundList