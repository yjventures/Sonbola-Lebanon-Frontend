import { useAtomValue } from 'jotai'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import UserDetails from 'src/components/Profile/UserDetails/UserDetails'
import { userAtom } from 'src/lib/jotai'
import heartIcon from "assets/wishlist-and-orders/heart.svg"
import { IoReorderThreeOutline } from 'react-icons/io5';
import ProfileSidebar from 'src/components/Profile/ProfileSidebar/ProfileSidebar'
import { FaHeart } from "react-icons/fa6";
import { showToast } from 'src/components/Common/Toastify/Toastify'
import WishlistComponent from 'src/components/User/Wishlist/WishlistComponent'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'

const Wishlist = () => {
  const [showSidebar, setShowSidebar] = React.useState(false)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'));
  const queryClient = useQueryClient();
  const [isLoadingCart, setIsLoadingCart] = useState(false);
  const userId = JSON.parse(localStorage.getItem('user'))._id;

  const { isPending, isError, error, data: wishlist } = useQuery({
    queryKey: ['userWishlist'],
    queryFn: async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_PATH}/wishlists/wishlist/${user?._id}`, {
          headers: {
            Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`,
          },
        });

        const jsonData = await response.json();

        return jsonData.wishlist;
      } catch (error) {
        throw new Error(`Error fetching users: ${error.message}`);
      }
    },
  });



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
        showToast('Something went wrong', 'error');
      }
    } catch (error) {
      showToast('Something went wrong', 'error');
    }
  };

  const handleRemoveAllFromWishlist = async () => {
    try {

      // Iterate through each wishlist item and remove all products
      for (const wishlistItem of wishlist) {
        const products = wishlistItem.products;

        for (const product of products) {
          await handleRemoveFromWishlist(product._id, false);
        }
      }
    } catch (error) {
      console.log('Error removing all products from wishlist', error);
      showToast('Something went wrong', 'error');
    }
  };


  const handleAllAddToCart = async () => {

    setIsLoadingCart(true);

    try {
      // Iterate through each product in the wishlist and add it to the cart
      for (const wishlistItem of wishlist) {
        const products = wishlistItem.products;

        for (const product of products) {
          await axios.put(`${import.meta.env.VITE_API_PATH}/carts/add-product/${userId}`, {
            product_item: {
              name: product.name.en,
              product_id: product._id,
              quantity: 1,
              price: product.on_sale ? product.sales_price : product.price,
              total_price: product.on_sale ? Number(product.sales_price) * 1 : Number(product.price) * 1,
              shop_id: product.shop
            },
            comment: ""
          });
        }
      }

      await handleRemoveAllFromWishlist();
      showToast('All products added to cart successfully', 'success');
      navigate('/cart');
    } catch (error) {
      console.log('Caught error', error);
      showToast('Something went wrong', 'error');
    }

    setIsLoadingCart(false);
  };


  return (
    <div className='h-full p-3 font-main lg:-ms-10 lg:-mt-4'>
      <div className='lg:flex justify-between items-center relative'>
        <div className='flex items-center'>
          <FaHeart className='w-5 h-5 text-green-600' />
          <p className='text-xl font-bold ms-2'>My Wish list</p>
        </div>
        <div className='lg:hidden absolute top-0 right-2'>
          <IoReorderThreeOutline className='w-[20px] h-[20px]' onClick={() => {
            setShowSidebar(!showSidebar)
          }} />
        </div>
        <div className='lg:hidden'>
          {
            showSidebar && <ProfileSidebar />
          }
        </div>

        {/* // Add all to cart button */}
        <button
          onClick={() => {
            if (isLoadingCart) return;
            console.log(wishlist)
            if(!wishlist || wishlist.length === 0 || !wishlist[0].products || wishlist[0].products.length === 0){
              showToast('No products in wishlist', 'info');
              return;
            }
            handleAllAddToCart()
          }}
          className='border-2 bg-[#1A985B] px-[20px] py-[6px] rounded-sm text-[16px] font-[600] text-primary-text-color transition my-4 lg:mt-0'>
          Add all to cart
        </button>
      </div>
      {/* component of wishlist */}
      <WishlistComponent wishlist={wishlist} isPending={isPending} isError={isError} />
    </div>
  )
}

export default Wishlist