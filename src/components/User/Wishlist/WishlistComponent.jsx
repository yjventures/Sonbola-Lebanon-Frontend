import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react'
import { FaHeart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import ReactStars from 'react-stars';
import { showToast } from '../../Common/Toastify/Toastify';
import axios from 'axios';
import { FaCartShopping } from "react-icons/fa6";
import Sideover from '../Cart/Sideover/Sideover';

const WishlistComponent = ({ wishlist, isPending, isError }) => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));
  const queryClient = useQueryClient();
  const [isLoadingCart, setIsLoadingCart] = useState(false);
  const [open, setOpen] = useState(false);

  const handleRemoveFromWishlist = async (productId, showMessage) => {
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
        if (showMessage == true) {
          showToast('Product removed from wishlist', 'info')
        }

      } else {
        showToast('Error removing product from wishlist', 'error')
      }
    } catch (error) {
      showToast('Error removing product from wishlist', 'error')
    }
  };

  const handleAddToCart = async (product) => {
    setIsLoadingCart(true)
    const productName = product?.name?.en;
    const productId = product?._id;
    const shopId = product?.shop;
    // console.log(productName)
    // console.log(productId)
    // console.log(shopId)
    // console.log(product.on_sale ? product?.sales_price * quantity : product?.price * quantity)
    const userId = JSON.parse(localStorage.getItem('user'))._id
    // add product to cart
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_PATH}/carts/add-product/${userId}`, {
        product_item: {
          name: productName,
          product_id: productId,
          quantity: 1,
          price: product.on_sale ? product?.sales_price : product?.price,
          total_price: product.on_sale ? Number(product?.sales_price) * 1 : Number(product?.price) * 1,
          shop_id: shopId
        },
        "comment": ""
      })
      if (response.status === 200) {
        setOpen(true)
      } else {
        showToast('Something went wrong', 'error')
      }
    } catch (error) {
      console.log('Catched error', error)
    }
    setIsLoadingCart(false)
  }

  if (isPending) return 'Loading...'
  if (isError) console.log('Error')

  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-3 font-main relative '>
      <Sideover open={open} setOpen={setOpen} />
      {wishlist && wishlist?.length > 0 ? (
        wishlist[0]?.products?.length > 0 ? (
          wishlist[0]?.products?.map((product, index) => (
            <div
              key={index}
              style={{
                'boxShadow': '0px 1px 3px 0px #03004717'
              }}
              className='relative'
              onClick={() => {
                navigate(`/product/${product._id}`)
              }}
            >
              <div className='overflow-hidden cursor-pointer relative'>
                {/* off percentage */}
                {/* Assuming 'product_discount' is available in the new structure */}
                {product?.product_discount && (
                  <div className='absolute top-2 left-2 bg-[#1A985B] text-primary-text-color px-2 py-1 rounded-full z-10'>
                    <p className='text-[12px] px-2 font-[300]'>{product?.product_discount}% off</p>
                  </div>
                )}
                {/* image */}
                {/* Assuming 'images' is an array and you want to display the first image */}
                <img
                  src={product?.images[0]}
                  alt={product?.name.en}
                  className='w-full h-[280px] object-cover rounded-t-md hover:scale-105 transition'
                />
              </div>
              <div className='flex items-center justify-start flex-col w-full px-3 pb-3'>
                {/* tags and remove from wishlist */}
                <div className='flex items-center justify-between w-full my-2'>
                  <div className='flex items-start text-[12px] underline text-gray-400 flex-wrap'>
                    {product?.tags?.length == 0 && <p>No tag available</p>}
                    {product?.tags?.map((tag, index) => (
                      <p key={index} className='text-greay-600 ms-2 cursor-pointer'>
                        {tag}
                      </p>
                    ))}
                  </div>
                  <div className='flex gap-2'>
                    <FaHeart
                      tooltip='Remove from wishlist'
                      // show tooltip on hover

                      className='w-7 h-10 p-1 text-green-700 cursor-pointer transition hover:text-green-600 rounded-full'
                      onClick={(e) => {
                        e.stopPropagation();
                        // remove from wishlist
                        handleRemoveFromWishlist(product?._id, true);
                      }}
                    />

                    <FaCartShopping
                      className='w-7 h-10 p-1 text-green-700 cursor-pointer transition hover:text-green-600 rounded-full'
                      onClick={(e) => {
                        e.stopPropagation();
                        // remove from wishlist
                        handleAddToCart(product)
                        handleRemoveFromWishlist(product?._id, false);
                      }}
                    />
                  </div>
                </div>
                {/* details part */}
                <div className='ms-3 flex justify-center items-start flex-col w-full gap-1 text-secondary-text-color'>
                  <p className='text-md font-[600]'>
                    {product?.name.en.charAt(0).toUpperCase() + product?.name.en.slice(1)}
                  </p>
                  {/* Assuming 'product_rating' is available in the new structure */}
                  {
                    <ReactStars count={5} value={5} edit={false} size={24} color={'#ffd700'} />
                  }
                  <div>
                    {product?.sales_price ? (
                      <div className='flex justify-center items-center'>
                        <p className='text-[16px] font-[600] text-[#1A985B]'>${product?.sales_price}</p>
                        <p className='text-[12px] text-gray-400 line-through ms-3'>${product?.price}</p>
                      </div>
                    ) : (
                      <p className='text-[16px] font-[600] text-[#1A985B]'>${product?.price}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className='text-gray-400 text-center absolute mt-4'>No products in wishlist</p>
        )
      ) : (
        isPending ? <p>Loading...</p> : 'No products in wishlist'
      )}
    </div>
  );

}

export default WishlistComponent