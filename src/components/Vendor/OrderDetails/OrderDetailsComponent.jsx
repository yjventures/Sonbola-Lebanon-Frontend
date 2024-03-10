import React, { useState } from 'react'
import { FaPlus } from 'react-icons/fa';
import { IoMdArrowDropdown } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { showToast } from 'src/components/Common/Toastify/Toastify';
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSetAtom } from 'jotai';
import { shippingAndBillingAtom } from 'src/lib/jotai';


const OrderDetailsComponent = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const path = new URL(window.location.href).pathname;
    const queryClient = useQueryClient()
    const setShippingAndBillingAtom = useSetAtom(shippingAndBillingAtom)
    const [confirmModal, setConfirmModal] = useState(false)
    console.log('path', path)
    // console.log(id)
    const user = JSON.parse(localStorage.getItem('user'))
    const { isPending, isError, error, data } = useQuery({
        queryKey: ['order', id],
        queryFn: async () => {
            try {
                const response = await fetch(`${import.meta.env.VITE_API_PATH}/order-items/order-item/${id}`, {
                    headers: {
                        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
                    }
                });
                const jsonData = await response.json();
                return jsonData.product_item;
            } catch (error) {
                throw new Error(`Error fetching users: ${error.message}`);
            }
        },
    });

    console.log(data)
    const [orderStatus, setOrderStatus] = useState(data?.status || 'loading status'); // initial state

    const handleOrderStatusChange = async (e) => {
        const newOrderStatus = e.target.value;
        setOrderStatus(newOrderStatus);

        try {
            const res = await axios.put(`${import.meta.env.VITE_API_PATH}/order-items/update/${id}`, {
                "status": newOrderStatus
            });

            if (res.status === 200) {
                showToast('Status updated successfully', 'success');
                queryClient.invalidateQueries('orders')
                // navigate('/vendor-orders');
            } else {
                showToast('Something went wrong', 'error');
            }
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    console.log(data)
    // cancel and refund order
    const handleCancelAndRefundOrder = async () => {

        const res = await axios.put(`${import.meta.env.VITE_API_PATH}/order-items/update/${id}`, {
            canceled: true
        })
        if (res.status == 200) {
            showToast('Order cancelled successfully', 'success')
            navigate('/vendor-orders')
        } else {
            showToast('Something went wrong', 'error')
        }
    }

    return (
        <div className='font-main md:px-4'>
            {
                isPending && <p>Loading...</p>
            }
            {/* order id and placed on */}
            <div className='flex justify-between items-center flex-wrap'>
                <div className='flex gap-6 flex-wrap'>
                    <div className='flex gap-2 flex-wrap'>
                        <p className='text-gray-400'>Order ID</p>
                        <p className='uppercase'>{data?.order_id?._id}</p>
                    </div>
                    <div className='flex gap-2'>
                        <p className='text-gray-400'>Placed On</p>
                        <p>{data?.order_id?.creation_date && new Date(data?.order_id?.creation_date).toLocaleDateString()}</p>
                    </div>
                </div>
                {
                    path.startsWith('/order-details') && <button
                        onClick={() => {
                            let shipping_address = data?.order_id?.shipping_address
                            let billing_address = data?.order_id?.billing_address
                            setShippingAndBillingAtom({
                                shipping_address: shipping_address,
                                billing_address: billing_address
                            })
                            navigate(`/invoice/${data._id}`)
                        }}
                        className='border-2 bg-green-600 hover:bg-[#1A985B] flex items-center gap-1 border-[#1A985B] hover:text-primary-text-color px-[20px] py-[6px] rounded-[3px] text-[16px] font-[600] text-primary-text-color transition my-4 lg:mt-0'>
                        Invoice
                        <IoIosArrowForward />
                    </button>
                }
            </div>

            {/* product name and status */}
            <div className='relative my-6'>
                <select
                    // make disabled if the order is cancelled
                    disabled={path.startsWith('/invoice') == true}
                    className='w-full block rounded-md border-0 p-3 text-gray-900 shadow-sm ring-1 outline-none ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6 appearance-none'
                    value={orderStatus}
                    onChange={handleOrderStatusChange}
                >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                </select>
                {
                    (path.startsWith('/order-details') == true || path.startsWith('/admin-order-details') == true) &&
                    <IoMdArrowDropdown className='absolute right-2 top-4' />
                }

                {/* <div className='w-full flex '>
                    <button
                        onClick={handleOrderStatusUpdate}
                        className='border-2 bg-green-600 hover:bg-[#1A985B] flex items-center gap-1 border-[#1A985B] hover:text-primary-text-color px-[20px] py-[6px] rounded-[3px] text-[16px] font-[600] text-primary-text-color transition my-4 lg:mt-0'
                    >Update Order Status</button>
                </div> */}
            </div>
            {/* bulk products */}
            <div className='grid grid-cols-1 md:grid-cols-2 items-center gap-4 mt-4 mb-5 rounded-md md:pe-2'>
                <div className='flex justify-start gap-1'>
                    <div className='min-w-28 w-28 h-28 rounded-md'>
                        {
                            data?.product_id?.images[0] !== '' ? <img src={data?.product_id?.images[0]} alt="product" className='w-full h-full object-cover rounded-md' /> :
                                <img
                                    src="https://www.apple.com/newsroom/images/product/iphone/standard/Apple_announce-iphone12pro_10132020_big.jpg.large.jpg"
                                    alt="product" className='w-full h-full rounded-md object-cover' />
                        }
                    </div>
                    <div className='ms-2'>
                        <p className='text-md font-[500]'>{data?.name.en}</p>
                        <p className='mt-3'> ${data?.price} x {data?.quantity}</p>
                    </div>
                </div>
                {/* <p className='text-sm md:text-end'>
                    Product color : Black
                </p> */}

            </div>
            {/* shipping address, customer note and total summery */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mt-4'>
                {/* shipping and customer night */}
                <div className='flex flex-col md:gap-16 gap-10'>
                    <div>
                        <p className='text-gray-400'>Shipping Address</p>
                        <p>{data?.order_id?.shipping_address.address1 + ', ' + data?.order_id?.shipping_address.country}</p>
                        <p>{data?.order_id?.shipping_address.address2 && data?.order_id?.shipping_address.address2 + ', ' + data?.order_id?.shipping_address.country}</p>
                    </div>
                    <div>
                        <p className='text-gray-400'>Customer Note</p>
                        <p>{data?.order_id?.comment == '' ? 'N/A' : data?.order_id?.comment}</p>
                    </div>
                </div>
                {/* total summary */}
                <div className='flex flex-col gap-2'>
                    <p className='font-semibold'>Total Summary</p>
                    <div className='flex justify-between my-2 text-gray-500'>
                        <p>Subtotal</p>
                        <p>${data?.total_price}</p>
                    </div>
                    <div className='flex justify-between my-2 text-gray-500'>
                        <p>Shipping fee</p>
                        <p>${data?.shipping}0 G</p>
                    </div>
                    <div className='flex justify-between my-2 text-gray-500'>
                        <p>Discount</p>
                        <p>${data?.discount}0 G</p>
                    </div>
                    <div className='flex justify-between my-2 text-gray-500'>
                        <p>Platform Commission</p>
                        <p>${data?.tax}0 G</p>
                        {/* <p>Under review</p> */}
                    </div>
                    <hr />
                    <div className='flex justify-between my-2 text-gray-500'>
                        <p>Total</p>
                        <p>${data?.total_price}</p>
                    </div>
                    <p className='text-[12px]'>Paid by Credit/Debit Card</p>
                </div>
            </div>
            {/* cancel and refund order */}
            {
                path.startsWith('/order-details') || path.startsWith('/admin-order-details') &&
                <button
                    onClick={() => {
                        setConfirmModal(true)
                    }}
                    className='mt-4 bg-red-600 text-primary-text-color px-3 py-2 rounded-sm'>
                    Cancel and Refund Order
                </button>
            }
            {
                confirmModal &&
                <div className='fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center'>
                    <div className='bg-white p-5 rounded-md'>
                        <p className='text-center text-lg font-semibold'>Are you sure you want to cancel and refund this order?</p>
                        <div className='flex justify-center gap-4 mt-5'>
                            <button
                                onClick={() => {
                                    setConfirmModal(false)
                                }}
                                className='bg-gray-600 text-primary-text-color px-4 py-1 rounded-sm hover:bg-gray-500 transition'>No</button>
                            <button
                                onClick={handleCancelAndRefundOrder}
                                className='bg-red-600 text-primary-text-color px-4 py-1 rounded-sm'>Yes</button>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default OrderDetailsComponent