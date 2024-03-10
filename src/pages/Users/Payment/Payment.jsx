import axios from 'axios'
import { useAtomValue } from 'jotai'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { showToast } from 'src/components/Common/Toastify/Toastify'
import Stepper from 'src/components/User/Cart/Stepper/Stepper'
import { userAtom } from 'src/lib/jotai'
import paymentGif from 'assets/user/payment/payment.gif'

const Payment = () => {
    const navigate = useNavigate()
    const cartItems = JSON.parse(localStorage.getItem('cartItems'))
    const [loading, setLoading] = useState(false)
    const user = useAtomValue(userAtom)
    // console.log(releventData.cartId)
    const handlePlaceOrder = async () => {
        // Place order logic here
        console.log(cartItems)
        setLoading(true)
        try {
            const res = await axios.post(`${import.meta.env.VITE_API_PATH}/customer-orders/create`, cartItems)
            if (res.status == 200) {
                const response = await axios.put(`${import.meta.env.VITE_API_PATH}/carts/delete-product/${user._id}`, {
                    // map here
                    item_id: cartItems.items.map(item => item._id),
                    permanent: false
                })
                // console.log(response)
                if (response.status === 200) {
                    navigate('/payment-success')
                    setLoading(false)
                } else {
                    showToast('Error on removing from cart', 'info')
                    setLoading(false)
                }
            } else {
                showToast('Something went wrong', 'error')
                setLoading(false)
            }
        } catch (error) {
            showToast('Something went wrong', 'error')
            setLoading(false)
        }


    }

    return (
        <div className='h-full p-3 font-main max-w-7xl mx-auto'>
            <Stepper activeStep={2} />

            <div className='grid grid-cols-1 md:grid-cols-6 gap-4'>
                {/* Shipping and billing address */}
                <div className='col-span-1 md:col-span-4 space-y-8'>
                    {/* shipping address */}
                    <div className='md:px-8 md:py-4 flex items-center justify-center flex-col'
                        style={{
                            boxShadow: '0px 1px 3px 0px #03004717'
                        }}>
                        <img src={paymentGif} alt="gif" />
                        <p>Processing your payment here </p>
                    </div>
                    {/* billing address */}
                    {/* <div className='md:px-8 md:py-4' style={{
                        boxShadow: '0px 1px 3px 0px #03004717'
                    }}>
                        ...

                    </div> */}


                    {/* buttons */}
                    <div className='flex justify-between items-center gap-3'>
                        {/* <button
                            className='ms-auto border-[1px] border-green-400 px-3 py-2 rounded-md text-green-500 transition w-40'
                            onClick={() => {
                                navigate('/delivery')
                            }}
                        >
                            Back to Cart
                        </button> */}
                        <button
                            className='bg-green-700 text-primary-text-color px-3 py-2 rounded-md hover:bg-green-600 transition w-full'
                            onClick={handlePlaceOrder}
                        >
                            {
                                loading === true ? 'Placeing Order' : 'Place Order'
                            }

                        </button>
                    </div>

                </div>


                {/* cart info of right side*/}
                <div className="col-span-1 md:col-span-2 align-top">
                    <div className='flex flex-col gap-3 p-7'>

                        <div className='flex justify-between text-[18px]'>
                            <p className='text-gray-500'>Subtotal :</p>
                            <p className='text-secondary-text-color font-[600]'>${cartItems.sub_total.toFixed(2)}</p>
                        </div>

                        <div className='flex justify-between text-[18px]'>
                            <p className='text-gray-500'>Shipping :</p>
                            <p className='text-secondary-text-color font-[600]'>-</p>
                        </div>

                        <div className='flex justify-between text-[18px]'>
                            <p className='text-gray-500'>Tax :</p>
                            <p className='text-secondary-text-color font-[600]'>${Number(cartItems.tax).toFixed(2)}</p>
                        </div>

                        <div className='flex justify-between text-[18px]'>
                            <p className='text-gray-500'>Discount :</p>
                            <p className='text-green-600 font-[600]'>${Number(cartItems.discount).toFixed(2)}</p>
                        </div>

                        <hr className='w-full bg-gray-200 h-[2px] my-2' />

                        <div className='flex justify-between text-[18px]'>
                            <p className='text-secondary-text-color font-[600]'>Total :</p>
                            <p className='text-secondary-text-color font-[600]'>${Number(cartItems.total_price).toFixed(2)}</p>
                        </div>

                        {/* vouchar
                        <div className='flex gap-2 items-center mt-4'>
                            <input
                                type="text"
                                placeholder="Voucher Code"
                                className='w-full h-10 px-4 border-[1px] border-gray-300 rounded-md focus:outline-none focus:border-green-600'
                            />

                        </div>
                        <button
                            className='bg-green-700 text-primary-text-color px-3 py-2 rounded-md hover:bg-green-600 transition'
                        >
                            Apply
                        </button> */}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Payment