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

const CustomerList = () => {
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


    const { isPending, isError, error, data } = useQuery({
        queryKey: ['users', { is_verified, page, limit }],
        queryFn: async () => {
            try {
                // const response = await fetch(`${import.meta.env.VITE_API_PATH}/users/get-all?is_approved=${is_approved}&type=vendor`, {
                const response = await fetch(`${import.meta.env.VITE_API_PATH}/users/get-all?type=customer&page=${page}&limit=${limit}&is_verified=${is_verified}`, {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
                    }
                });

                const jsonData = await response.json();
                return jsonData.users; // Access the 'users' array directly
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
            <p className='font-[600]'>Customer List</p>
            {/* {is_verified == false ? 'Verfied' : 'Approved'}  */}
            <div className='flex justify-between items-center flex-col lg:flex-row gap-y-2'>
                <div className='relative'>
                    <input type="text"
                        onChange={(e) => {
                            setSearch(e.target.value)
                        }}
                        className='py-1 px-7 mt-3 w-[200px] md:w-[400px]  outline-none rounded-sm text-[14px] h-[35px]' placeholder='Search customers...' />
                    <IoMdSearch className='absolute top-[23px] w-7 h-4' />
                </div>
                {/* buttons */}
                <div className='flex gap-2'>
                    {/* <button className='bg-[#FFDEE6] text-[#D93F21] rounded-sm px-4 py-2' onClick={() => setIs_verified(!is_verified)}>Show {is_verified == false ? 'Verified' : 'Unverified'} Csutomer</button> */}
                    <button className='bg-[#1A985B] text-primary-text-color rounded-sm px-4 py-2 flex items-center gap-1'>
                        <FaPlus />
                        Add Customer
                    </button>
                </div>
            </div>
            {/* table for vendors */}
            <div className="sm:px-6 lg:px-1 ">
                <div className="-mx-4 mt-10 ring-1 ring-gray-300 sm:mx-0 sm:rounded-lg bg-white">
                    <table className="min-w-full divide-y divide-gray-300">
                        <thead>
                            <tr>
                                <th scope="col" className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 lg:table-cell">
                                    User
                                </th>

                                <th
                                    scope="col"
                                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                                >
                                    Email
                                </th>
                                <th
                                    scope="col"
                                    className="hidden px-3 py-3.5 text-left text-sm font-semibold text-gray-900 lg:table-cell"
                                >
                                    {/* Wallet Balance */}
                                    Verification status
                                </th>
                                {/* <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                                    Main Category
                                </th> */}
                                <th scope="col" className="px-3 py-3.5 text-center text-sm font-semibold text-gray-900">
                                    Action
                                </th>

                            </tr>
                        </thead>
                        <tbody>
                            {
                                isPending && (
                                    <tr>
                                        <td colSpan='6' className='text-center py-4'>Loading...</td>
                                    </tr>
                                )
                            }
                            {
                                data?.length === 0 && (
                                    <tr>
                                        <td colSpan='6' className='text-center py-4'>No Vendor Found</td>
                                    </tr>
                                )
                            }
                            {data
                                ?.filter((user) => user?.firstname.toLowerCase().includes(search.toLocaleLowerCase()))
                                ?.map((user, userIndex) => (
                                    <tr key={user._id}>
                                        <td
                                            className={classNames(
                                                userIndex === 0 ? '' : 'border-t border-gray-200',
                                                'relative py-4 pl-4 pr-3 text-sm sm:pl-6'
                                            )}
                                        >
                                            <div className="font-medium text-gray-900 flex items-center justify-start gap-2">
                                                {
                                                    user?.image ? <img src={user?.image} alt='image' className='w-7 h-7 border-2 rounded-full' />
                                                        : <RxAvatar className='w-7 h-7 text-gray-400' />
                                                }
                                                {user?.firstname} {user?.lastname}
                                            </div>
                                        </td>

                                        <td
                                            className={classNames(
                                                userIndex === 0 ? '' : 'border-t border-gray-200',
                                                'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell'
                                            )}
                                        >
                                            {user?.email}
                                        </td>
                                        <td
                                            className={classNames(
                                                userIndex === 0 ? '' : 'border-t border-gray-200',
                                                'hidden px-3 py-3.5 text-sm text-gray-500 lg:table-cell'
                                            )}
                                        >
                                            {user?.is_verified == true ?
                                                <span className='bg-green-600 text-primary-text-color py-1 px-4 rounded-full ms-4'>
                                                    Verified
                                                </span> :
                                                <span className='bg-red-600 text-primary-text-color py-1 px-4 rounded-full ms-1'>
                                                    Not Verified
                                                </span>
                                            }
                                        </td>

                                        <td
                                            className={classNames(
                                                userIndex === 0 ? '' : 'border-t border-gray-200',
                                                'relative py-3.5 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 flex justify-center items-center gap-2'
                                            )
                                            }
                                        >
                                            {/* view and delete */}
                                            {/* <MdOutlineRemoveRedEye
                                            onClick={() => {
                                                setViewVendor(user)
                                                navigate(`/approve-vendor`)
                                            }}
                                            className='mr-2 cursor-pointer w-5 h-5'
                                        /> */}
                                            <AiFillDelete
                                                onClick={handleDeleteVendor(user?._id)}
                                                className='cursor-pointer w-5 h-5 hover:text-red-600 transition'
                                            />
                                        </td>
                                    </tr>
                                ))}
                        </tbody>


                    </table>
                    {/* pagination */}
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

export default CustomerList