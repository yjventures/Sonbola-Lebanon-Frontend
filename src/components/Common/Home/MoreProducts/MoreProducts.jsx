import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react'
import ReactStars from 'react-stars';
import { showToast } from '../../Toastify/Toastify';
import { useNavigate } from 'react-router-dom';
import { CiHeart } from "react-icons/ci";

const MoreProducts = () => {

    const user = JSON.parse(localStorage.getItem('user'))?._id
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const { isPending, isError, error, data } = useQuery({
        queryKey: ['more_for'],
        queryFn: async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_PATH}/products/get-all?limit=20`)
                // console.log(response.data)
                return response?.data?.product_info
            } catch (error) {
                throw new Error(`Error fetching users: ${error.message}`);
            }
        },
    });

    
    // add to wishlist
    const handleAddtoWishlist = async (productId) => {
        if (!user) {
            navigate('/signin')
            return;
        }

        try {
            const response = await axios.put(`${import.meta.env.VITE_API_PATH}/wishlists/add-product/${user}`, {
                product: productId,
            }, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
                }
            })

            // console.log(response.data)
            if (response.status === 200) {
                queryClient.invalidateQueries('userWishlist');
                showToast('Product added to wishlist', 'success')
            } else {
                showToast('Error adding product to wishlist', 'error')
            }

        } catch (error) {
            showToast('Error adding product to wishlist', 'error')
        }
    }

    return (
        <div className='font-main mt-6'>
            <div className='flex gap-2 items-center'>
                <p className='text-[20px] font-[600] text-secondary-text-color'>More For You</p>

            </div>
            {
                isPending && <p>Loading...</p>
            }
            {
                isError && <p>Something went wrong</p>
            }
            <div className='grid md:grid-cols-3 lg:grid-cols-4 grid-cols-1 gap-4 my-10'>
                {
                    data?.length == 0 && <p>No products found</p>
                }
                {
                    data?.slice(0, 4)?.map((product, index) => {
                        return (
                            <div
                                key={index}
                                onClick={() => navigate(`/product/${product?._id}`)}

                                className='flex items-center mb-5 flex-col min-w-[280px] mx-auto rounded-lg cursor-pointer overflow-hidden '
                            >
                                <div className='w-full h-[277px] overflow-hidden'>
                                    <img
                                        src={product?.images[0]}
                                        alt="image"
                                        className='w-full h-[277px] object-cover rounded-t-lg hover:scale-105 transition'
                                    />
                                </div>

                                <div className='flex flex-col gap-2 rounded-b-md w-full p-4'>
                                        <div className='flex justify-between items-center'>
                                            <div>
                                                {product?.tags?.join(',')?.split(',')?.map((tag, index) => (
                                                    <span key={index} className='text-[12px] pb-[1px] border-b-[1px] border-gray-300 me-2 text-secondary-text-color'>
                                                        {tag?.trim()}
                                                    </span>
                                                ))}
                                            </div>
                                            <CiHeart
                                                className={`w-6 h-6 hover:scale-110 cursor-pointer text-gray-500 border-gray-800`}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleAddtoWishlist(product?._id);
                                                }}
                                            />
                                        </div>
                                        <p className='font-[600] text-md text-secondary-text-color'>
                                            {product?.name?.en?.split(' ')?.map((word) => word?.charAt(0)?.toUpperCase() + word?.slice(1))?.join(' ')}
                                        </p>
                                        {/* rating */}
                                        <ReactStars count={5} value={product?.rating} edit={false} size={20} color2={'#FFCD4E'} />
                                        <div className='flex justify-start items-center gap-3'>
                                            {product?.sales_price ?
                                                <>
                                                    <p className='text-[16px] text-green-500 font-[600] '>${product?.sales_price}</p>
                                                    <p className='text-[14px] text-gray-500 line-through'>${product?.price}</p>
                                                </> :
                                                <>
                                                    <p className='text-[16px] text-green-500 font-[600] '>${product?.price}</p>
                                                </>
                                            }
                                        </div>
                                    </div>
                            </div>
                        );
                    })
                }

            </div>
        </div>
    )
}

export default MoreProducts