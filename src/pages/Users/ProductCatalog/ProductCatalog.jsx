import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import ReactSlider from 'react-slider'
import ReactStars from 'react-stars';
import BottomAdvertisement from 'src/components/Common/BottomAdvertisement/BottomAdvertisement';
import { CiHeart } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import { showToast } from 'src/components/Common/Toastify/Toastify';
import axios from 'axios';
import { useAtomValue } from 'jotai';
import { userAtom } from 'src/lib/jotai';
import { FaHeart } from 'react-icons/fa';
import { basicColors } from 'src/lib/helper/basicColors'


const ProductCatalog = () => {
    const navigate = useNavigate();
    const user = useAtomValue(userAtom)
    const queryClient = useQueryClient();

    const [minValue, setMinValue] = useState(0);
    const [maxValue, setMaxValue] = useState(50000);
    const [currentMinValue, setCurrentMinValue] = useState(minValue);
    const [currentMaxValue, setCurrentMaxValue] = useState(maxValue);

    const [selectedBrands, setSelectedBrands] = useState(['Pulsar', 'Apple']);
    const [selectedTypes, setSelectedTypes] = useState([]);
    const [selectedRatings, setSelectedRatings] = useState([]);
    const [selectedColor, setSelectedColor] = useState(null);
    // console.log(selectedBrands, selectedTypes, selectedRatings, selectedColor)
    const userId = JSON.parse(localStorage.getItem('user'))?._id

    const { isPending, isError, error, data } = useQuery({
        queryKey: ['products', selectedBrands, selectedColor, selectedRatings, selectedTypes, currentMinValue, currentMaxValue],
        queryFn: async () => {
            try {
                const response = await axios.post(`${import.meta.env.VITE_API_PATH}/products/filter`, {
                    low_price: currentMinValue,
                    high_price: currentMaxValue,
                    // brands: selectedBrands,
                    ...(selectedBrands.length !== 0 && {brands: selectedBrands}),
                    on_sale: selectedTypes.includes('On Sale') ? true : false,
                    featured: selectedTypes.includes('Featured') ? true : false,

                    // in_stock: selectedTypes.includes('In Stock') ? true : false,
                    // colors: selectedColor,
                    // "categories": [
                    //     "Coffee", "Phone"
                    // ],
                })
                // console.log(response.data)
                return response?.data?.products
            } catch (error) {
                throw new Error(`Error fetching users: ${error.message}`);
            }
        },
    });
    // console.log(data)

    const handleColorClick = (colorName) => {
        setSelectedColor((prevSelectedColor) =>
            prevSelectedColor === colorName ? null : colorName
        );
    };

    console.log(selectedBrands, selectedTypes, selectedRatings)
    const handleSliderChange = (values) => {
        setCurrentMinValue(values[0]);
        setCurrentMaxValue(values[1]);
    };

    const handleBrandChange = (event) => {
        const brand = event.target.value;
        setSelectedBrands((prevSelectedBrands) =>
            prevSelectedBrands.includes(brand)
                ? prevSelectedBrands.filter((b) => b !== brand)
                : [...prevSelectedBrands, brand]
        );
    };

    const handleTypeChange = (event) => {
        const type = event.target.value;
        setSelectedTypes((prevSelectedTypes) =>
            prevSelectedTypes.includes(type)
                ? prevSelectedTypes.filter((t) => t !== type)
                : [...prevSelectedTypes, type]
        );
    };

    const handleRatingChange = (event) => {
        const rating = parseInt(event.target.value);
        setSelectedRatings((prevSelectedRatings) =>
            prevSelectedRatings.includes(rating)
                ? prevSelectedRatings.filter((r) => r !== rating)
                : [...prevSelectedRatings, rating]
        );
    };


    const brands = ['Apple', 'Samsung', 'Sony', 'Nokia', 'Meril', 'Pulsar'];
    const types = ['On Sale', 'In Stock', 'Featured'];
    

    // get user wishlist
    const [wishlist, setWishlist] = useState([])

    const fetchWishlist = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_PATH}/wishlists/wishlist/${userId}`, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`,
                },
            });

            const jsonData = await response.json();
            console.log(jsonData.wishlist)
            setWishlist(jsonData.wishlist);
        } catch (error) {
            console.error('Error fetching wishlist', error)
            // showToast('Error fetching wishlist', 'error')
        }
    }
    useEffect(() => {
        fetchWishlist()
    }, [])

    // console.log(wishlist)
    // console.log(userId)
    // remove from wishlist
    const handleRemoveFromWishlist = async (productId) => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_PATH}/wishlists/delete-product/${user?._id}`, {
                product: productId,
            }, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
                }
            })

            if (response.status === 200) {
                queryClient.invalidateQueries('userWishlist');
                showToast('Product removed from wishlist', 'info')
                fetchWishlist()
            } else {
                showToast('Error removing product from wishlist', 'error')
            }
        } catch (error) {
            showToast('Error removing product from wishlist', 'error')
        }
    };

    // add to wishlist
    const handleAddtoWishlist = async (productId) => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_PATH}/wishlists/add-product/${user?._id}`, {
                product: productId,
            }, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
                }
            })

            // console.log(response.data)
            if (response.status === 200) {
                queryClient.invalidateQueries('userWishlist');
                fetchWishlist();
                showToast('Product added to wishlist', 'success')
            } else {
                showToast('Error adding product to wishlist', 'error')
            }

        } catch (error) {
            showToast('Error adding product to wishlist', 'error')
        }
    }


    return (
        <div className='max-w-7xl mx-auto mt-10 mb-3 px-3 font-main'>
            {/* for making grid */}
            <div className='grid md:grid-cols-12 grid-cols-1 gap-3 '>
                {/* filtering part */}
                <div className='md:col-span-3 col-span-12 p-5 rounded-md text-sm ' style={{
                    boxShadow: '0px 0px 5px 0px rgba(3, 0, 71, 0.09)'
                }}>
                    <p className='font-[600] mb-2 cursor-pointer text-secondary-text-color'>Categories</p>
                    <p className='mb-2 cursor-pointer hover:underline text-secondary-text-color'>Eye Makeup Preparations</p>
                    <p className='mb-2 cursor-pointer hover:underline text-secondary-text-color'>Fragrance</p>
                    <p className='mb-2 cursor-pointer hover:underline text-secondary-text-color'>Phone</p>
                    <p className='mb-2 cursor-pointer hover:underline text-secondary-text-color'>Coffee</p>
                    {/* hr line */}
                    <hr className='border-b-[1px] border-gray-300 w-full my-7' />
                    {/* slider for price */}
                    <p className='font-[600] mb-14'>Price Range</p>
                    <div className="relative">
                        <ReactSlider
                            className="horizontal-slider bg-red-600 h-[1px] w-full cursor-pointer"
                            thumbClassName="example-thumb bg-red-500 rounded-full text-primary-text-color w-4 absolute -top-2 h-4 flex justify-center items-center shadow-md cursor-pointer border-2 border-red-500 outline-none"
                            trackClassName="example-track"
                            defaultValue={[minValue, maxValue]}
                            onChange={handleSliderChange}
                            ariaValuetext={state => `Thumb value ${state.valueNow}`}
                            // renderThumb={(props, state) => <div {...props}>{state.valueNow}</div>}
                            pearling
                            minDistance={10}
                            min={minValue}
                            max={maxValue}
                        />

                        <div className='absolute start-0 -top-10 flex gap-1'>
                            <p className="text-sm text-gray-500 dark:text-gray-400 ">${minValue}</p>
                            -
                            <p className="text-sm text-gray-500 dark:text-gray-400 ">${maxValue}</p>
                        </div>
                        <p className='mt-5 text-gray-700'>
                            Curent range : ${currentMinValue} - ${currentMaxValue}
                        </p>
                    </div>
                    {/* hr line */}
                    <hr className='border-b-[1px] border-gray-300 w-full my-7' />
                    {/* Brands */}
                    <p className='font-[600] cursor-pointer mb-3'>Brands</p>
                    {brands?.map((brand, index) => (
                        <div key={index} className='flex gap-2 justify-start items-center my-1'>
                            <input
                                type='checkbox'
                                id={index}
                                name={brand}
                                value={brand}
                                checked={selectedBrands.includes(brand)}
                                onChange={handleBrandChange}
                                className='mb-1 cursor-pointer hover:underline w-4 h-4 text-gray-100 rounded-md'
                            />
                            <p key={index} className='mb-1 text-[14px]'>
                                {brand}
                            </p>
                        </div>
                    ))}
                    {/* hr line */}
                    <hr className='border-b-[1px] border-gray-300 w-full my-7' />
                    {types?.map((type, index) => (
                        <div key={index} className='flex gap-2 justify-start items-center my-1'>
                            <input
                                type='checkbox'
                                id={index}
                                name={type}
                                value={type}
                                checked={selectedTypes.includes(type)}
                                onChange={handleTypeChange}
                                className='mb-1 cursor-pointer hover:underline w-4 h-4 text-gray-100 rounded-md'
                            />
                            <p key={index} className='mb-1 text-[14px]'>
                                {type}
                            </p>
                        </div>
                    ))}
                    {/* hr line */}
                    <hr className='border-b-[1px] border-gray-300 w-full my-7' />
                    {/* ratings */}
                    {[1, 2, 3, 4, 5]?.reverse()?.map((item, index) => (
                        <div key={index} className='flex gap-2 justify-start items-center my-1'>
                            <input
                                type='checkbox'
                                id={index}
                                name={item}
                                value={item}
                                checked={selectedRatings.includes(item)}
                                onChange={handleRatingChange}
                                className='cursor-pointer hover:underline w-4 h-4 text-gray-100 rounded-md'
                            />
                            <ReactStars count={5} value={item} edit={false} size={20} color2={'#FFCD4E'} />
                        </div>
                    ))}
                    {/* hr line */}
                    <hr className='border-b-[1px] border-gray-300 w-full my-7' />
                    {/* colors */}
                    <p className='font-[600] cursor-pointer mb-3'>Colors</p>
                    <div className='flex gap-2 flex-wrap'>

                        {basicColors?.map((color, index) => (
                            <div
                                key={index}
                                onClick={() => handleColorClick(color.name)}
                                className={`flex gap-2 justify-start items-center my-1 cursor-pointer `}
                            >
                                <div
                                    className={`w-6 h-6 rounded-full ${selectedColor === color.name ? 'outline outline-gray-500' : ''}`}
                                    style={{ backgroundColor: color.hex }}
                                ></div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* product showcase part */}
                <div className='md:col-span-9 col-span-12'>
                    {
                        isPending && <p>Loading...</p>
                    }
                    {
                        isError && <p>Something went wrong</p>
                    }
                    <div className='grid md:grid-cols-2 lg:grid-cols-3 grid-cols-1 gap-3'>
                        {
                            data?.length == 0 && <p>No products found</p>
                        }
                        {
                            data?.map((product, index) => {
                                const isInWishlist = wishlist && wishlist.some((item) => item.products.some((p) => p._id === product._id));

                                return (
                                    <div
                                        key={index}
                                        onClick={() => navigate(`/product/${product?._id}`)}
                                        style={{
                                            boxShadow: '0px 1px 3px 0px rgba(3, 0, 71, 0.1)',
                                        }}
                                        className='flex items-center mb-5 flex-col min-w-full md:min-w-[280px]  mx-auto rounded-lg cursor-pointer overflow-hidden '
                                    >
                                        <div className='w-full h-[277px] overflow-hidden'>
                                            <img
                                                src={product?.images[0]}
                                                alt="image"
                                                className='w-full max-w-[300px] mx-auto h-[277px] object-cover rounded-t-lg hover:scale-105 transition'
                                            />
                                        </div>

                                        <div className='flex flex-col gap-2 rounded-b-md w-full p-4'>
                                            <div className='flex justify-between items-center'>
                                                <div>
                                                    {product?.tags?.join(',')?.split(',')?.map((tag, index) => (
                                                        <span key={index} className='text-[12px] pb-[1px] border-b-[1px] border-gray-300 me-2'>
                                                            {tag?.trim()}
                                                        </span>
                                                    ))}
                                                </div>
                                                {wishlist && (
                                                    <FaHeart
                                                        className={`w-6 h-6 hover:scale-110 cursor-pointer ${isInWishlist ? 'text-green-600' : 'text-gray-300 border-gray-800'}`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (isInWishlist) {
                                                                handleRemoveFromWishlist(product?._id);
                                                            } else {
                                                                handleAddtoWishlist(product?._id);
                                                            }
                                                        }}
                                                    />
                                                )}
                                            </div>
                                            <p className='font-[600] text-md '>
                                                {product?.name?.en?.split(' ')?.map((word) => word?.charAt(0)?.toUpperCase() + word?.slice(1))?.join(' ')}
                                            </p>
                                            {/* rating */}
                                            <ReactStars count={5} value={product?.rating} edit={false} size={20} color2={'#FFCD4E'} />
                                            <div className='flex justify-start items-center gap-3'>
                                                <p className='text-[16px] text-green-500 font-[600]'>${product?.price}</p>
                                                {product?.sales_price && <p className='text-[14px] text-gray-500 line-through'>${product?.sales_price}</p>}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        }

                    </div>

                </div>
            </div>
            <BottomAdvertisement />
        </div>
    )
}

export default ProductCatalog