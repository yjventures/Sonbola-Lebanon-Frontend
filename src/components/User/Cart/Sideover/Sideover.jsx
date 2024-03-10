import { Fragment, useEffect, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { HiXMark } from "react-icons/hi2";
import { useQuery } from '@tanstack/react-query';
import { TbLayoutSidebarRightCollapseFilled } from "react-icons/tb";
import { useNavigate } from 'react-router-dom';

export default function Sideover({ open, setOpen }) {
    const navigate = useNavigate()
    const userId = JSON.parse(localStorage.getItem('user'))?._id;
    const { isPending, data: cartProducts, error } = useQuery({
        queryKey: ['sidecart', open],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_PATH}/carts/cart/${userId}`)
            const result = await response.json();
            return result?.cart;
        }
    })

    
    // const [cartProducts, setCartProducts] = useState([]);
    // const [isPending, setIsPending] = useState(false);

    // const getCartProducts = () => {
    //     setIsPending(true)
    //     fetch(`${import.meta.env.VITE_API_PATH}/carts/cart/${userId}`)
    //         .then(res => res.json())
    //         .then(data => setCartProducts(data.cart))
    //         .finally(() => setIsPending(false))
    // }

    // useEffect(() => {
    //     getCartProducts()
    // }, [open, userId])

    // console.log(cartProducts, 'cart')
    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={setOpen}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-in-out duration-500"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in-out duration-500"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-hidden">
                    <div className="absolute inset-0 overflow-hidden">
                        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                            <Transition.Child
                                as={Fragment}
                                enter="transform transition ease-in-out duration-500 sm:duration-700"
                                enterFrom="translate-x-full"
                                enterTo="translate-x-0"
                                leave="transform transition ease-in-out duration-500 sm:duration-700"
                                leaveFrom="translate-x-0"
                                leaveTo="translate-x-full"
                            >
                                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                                    <div className="flex h-full flex-col overflow-y-scroll bg-white py-6 shadow-xl">
                                        <div className="px-4 sm:px-6">
                                            <div className="flex items-center justify-start gap-3">

                                                <div className="flex h-7 items-center">
                                                    <button
                                                        // title='close menu'
                                                        type="button"
                                                        className="rounded-md bg-white text-gray-500 hover:text-gray-700 focus:outline-none"
                                                        onClick={() => setOpen(false)}
                                                    >
                                                        <span className="sr-only">Close panel</span>
                                                        <TbLayoutSidebarRightCollapseFilled className="h-6 w-6" />
                                                        {/* <HiXMark className="h-6 w-6" aria-hidden="true" /> */}
                                                    </button>
                                                </div>
                                                <Dialog.Title className="text-base font-semibold leading-6 text-gray-900 -mt-[1px]">
                                                    ITEMS IN YOUR CART
                                                </Dialog.Title>
                                            </div>
                                        </div>
                                        <div className="relative mt-6 flex-1 px-4 sm:px-6">
                                            {isPending && <p>Loading...</p>}
                                            {cartProducts && (
                                                <div>
                                                    {cartProducts?.items?.map((item) => (
                                                        <div key={item._id} className="flex mb-4 shadow-md rounded-md">
                                                            <img src={item?.product_id?.images[0]} alt={item.name.en} className="w-24 h-30 mr-4 object-cover rounded-s-md" />
                                                            <div className='py-2 flex flex-col'>
                                                                <p>{item.name.en}</p>
                                                                <p> <span className='text-green-500'> {item.quantity} </span> <span className='text-green-600'> x</span> <span className='text-green-500'> {item.price} </span></p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>

                                        <button
                                            onClick={() => navigate('/cart')}
                                            className='bg-black mx-4 py-2 text-white rounded-md'
                                        >
                                            Go to cart
                                        </button>
                                    </div>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}
