import { QueryClient, useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import ReactStars from 'react-stars';
import flashSale from 'assets/global/home/flashSale.svg'
import { showToast } from '../../Toastify/Toastify';
import { useNavigate } from 'react-router-dom';
import { CiHeart } from "react-icons/ci";
import Slider from "react-slick";

const FlashSale = () => {

    const user = JSON.parse(localStorage.getItem('user'))?._id
    const queryClient = useQueryClient();
    const navigate = useNavigate();




    const { isPending, isError, error, data } = useQuery({
        queryKey: ['flash_sale_products'],
        queryFn: async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_PATH}/products/get-all?tags=flash_sale`)
                // console.log(response.data)
                return response?.data?.product_info
            } catch (error) {
                throw new Error(`Error fetching users: ${error.message}`);
            }
        },
    });

    // const [sliderSettings, setSliderSettings] = useState();
    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 4,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
    }
    // useEffect(() => {
    //     const updateSliderSettings = () => {
    //         const width = window.innerWidth;
    //         let slidesToShow = 4;

    //         if (width < 768) { // Small devices
    //             slidesToShow = 1;
    //         } else if (width >= 768 && width < 1024) { // Medium devices
    //             slidesToShow = 2;
    //         } else { // Large devices and above
    //             slidesToShow = 4;
    //         }

    //         setSliderSettings(prevSettings => ({
    //             ...prevSettings,
    //             slidesToShow,
    //         }));
    //     };

    //     updateSliderSettings(); // Call once initially to set the correct value based on the current screen size
    //     window.addEventListener('resize', updateSliderSettings);

    //     // Cleanup listener on component unmount
    //     return () => window.removeEventListener('resize', updateSliderSettings);
    // }, []);

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
        <div className='mt-6 font-main'>
            <div className='flex gap-2 items-center'>
                <img src={flashSale} alt="icon" />
                <p className='text-[20px] font-[600] text-secondary-text-color'>Flash Sale</p>
            </div>
            {
                isPending && <p>Loading...</p>
            }
            {
                isError && <p>Something went wrong</p>
            }
            {
                data?.length == 0 && <p>No products found</p>
            }
            <div className='mt-4'>
                <Slider {...sliderSettings}>
                    {
                        data?.map((product, index) => {
                            return (
                                <div
                                    key={index}
                                    onClick={() => navigate(`/product/${product?._id}`)}

                                    className='flex items-center mb-5 flex-col max-w-[280px] mx-auto rounded-lg cursor-pointer overflow-hidden hover:bg-gray-50 '
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
                </Slider>
            </div>

        </div>
    )
}

export default FlashSale