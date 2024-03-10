import React, { useEffect, useState } from 'react'
import Stepper from 'src/components/User/Cart/Stepper/Stepper'
import Photo from 'assets/photo.svg'
import { FiPlus } from "react-icons/fi";
import { LuMinus } from "react-icons/lu";
import { RxCross2 } from "react-icons/rx";
import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { showToast } from 'src/components/Common/Toastify/Toastify';
import { cartItemsAtom } from 'src/lib/jotai';
import { useSetAtom } from 'jotai';


const Cart = () => {
  const navigate = useNavigate()
  const userId = JSON.parse(localStorage.getItem('user'))._id;
  const queryClient = useQueryClient();
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [subtotal, setSubtotal] = useState(0)
  const [tax, setTax] = useState(0)
  const [shipping, setShipping] = useState(0)
  const [discount, setDiscount] = useState(0)
  const [comment, setComment] = useState('')
  const setCartItemAtom = useSetAtom(cartItemsAtom)

  const handleProductSelect = (product) => {
    const isSelected = selectedProducts.some((selectedProduct) => selectedProduct._id === product._id);

    setSelectedProducts((prevSelectedProducts) => {
      if (isSelected) {
        const data = prevSelectedProducts.filter((selectedProduct) => selectedProduct._id !== product._id)
        getTotal();
        return data;
      } else {
        const data = [...prevSelectedProducts, product]
        getTotal();
        return data;
      }
    });
  };

  const { isPending, data: cartProducts, error } = useQuery({
    queryKey: ['cart', userId],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_PATH}/carts/cart/${userId}`)
      const result = await response.json();
      return result?.cart;
    }
  })
  console.log(cartProducts, 'cart')
  const { isPending: pendingCustomOrders, data: customOrders, error: errorCustomOrder } = useQuery({
    queryKey: ['customOrder', userId],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_PATH}/custom-orders/get-all?customer_id=${userId}&status=pending`)
      const result = await response.json();
      return result.custom_orders;
    }
  })
  // console.log(selectedProducts)
  // console.log(subtotal)
  // console.log(cartProducts, 'cart')
  // console.log(customOrders, 'customOrders')

  const getTotal = () => {
    let total = 0;
    // console.log(selectedProducts.length, cartProducts?.items.length)
    if (selectedProducts.length > 0) {
      selectedProducts.forEach((product) => {
        total += product.price * product.quantity;
      })
    } else {
      cartProducts?.items?.forEach((product) => {
        total += product.price * product.quantity;
      });
    }
    setSubtotal(total)
    setTax(parseFloat(total * 0.01)?.toFixed(2))
  };

  useEffect(() => {
    getTotal();
  }, [selectedProducts, cartProducts]);


  // for each product in the cart, get the product details
  const handleRemoveFromCart = (cartId) => async () => {
    // setReleventDataAtom({
    //   cartId : cartId
    // })
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_PATH}/carts/delete-product/${userId}`, {
        item_id: cartId,
        permanent: true
      })
      // console.log(response)
      if (response.status === 200) {
        queryClient.invalidateQueries('cart')
        getTotal();
      } else {
        showToast('Error on removing from cart', 'info')
      }
    } catch (error) {
      console.error('Error on removing from cart', 'info')
    }
  }

  const handleUpdateCart = (cartId, quantity, total_price) => async () => {
    // console.log(cartId, quantity, total_price)
    // "shipping": 0,
    //   "tax": 0,
    //     "discount": 0,
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_PATH}/carts/update-product/${userId}`, {
        "product_item": {
          "quantity": quantity,
          "total_price": total_price,
          "_id": cartId
        }
      })
      // console.log(response)
      if (response.status === 200) {
        // showToast('updated cart', 'info')
        queryClient.invalidateQueries('cart')
        getTotal();
      } else {
        showToast('Error on updating cart', 'info')
      }
    } catch (error) {
      console.error('Error on updating cart', 'info')
    }
  }

  // handleCartSelect for next button
  const handleCartSelect = () => {
    localStorage.removeItem('cartItems')
    if (selectedProducts.length > 0) {
      // map the selected products to the cartItemsAtom
      const items = selectedProducts.map((product) => ({
        name: product?.name,
        _id: product?._id,
        price: product?.price,
        quantity: product?.quantity,
        total_price: product?.total_price,
        image: product?.product_id?.images[0],
        product_id: {
          _id: product?.product_id?._id,
        },
        shop_id: {
          _id: product?.shop_id?._id,
        },
        product_varient: product?.product_varient,
        ordered: true,
        order_date: new Date(),
        paid_amount: product?.total_price
      }));

      const cartItems = {
        user_id: userId,
        items: items,
        total_price: Number(subtotal) + Number(tax),
        comment: comment ? comment : "",
        sub_total: subtotal,
        shipping: 0,
        tax: tax,
        discount: 0,
        // estimation = current date + 3 days
        estimation_date: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000),
        creation_date: new Date()
      }
      setCartItemAtom(cartItems)
    } else {
      // console.log('no selected products', cartProducts)
      const items = cartProducts?.items?.map((product) => ({
        name: product?.name,
        _id: product?._id,
        price: product?.price,
        quantity: product?.quantity,
        total_price: product?.total_price,
        image: product?.product_id?.images[0],
        product_id: {
          _id: product?.product_id?._id,
        },
        shop_id: {
          _id: product?.shop_id?._id,
        },
        product_varient: product?.product_varient,
        ordered: true,
        order_date: new Date(),
        paid_amount: product?.total_price
      }));

      const cartItems = {
        user_id: userId,
        items: items,
        total_price: Number(subtotal) + Number(tax),
        comment: comment ? comment : "",
        sub_total: subtotal,
        shipping: 0,
        tax: tax,
        discount: 0,
        // estimation = current date + 3 days
        estimation_date: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000),
        creation_date: new Date()
      }
      // console.log(cartItems)
      setCartItemAtom(cartItems)
    }
    navigate('/delivery')
  }


  const handleAcceptCustomOrder = async (id, order) => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_PATH}/custom-orders/update/${id}`, {
        status: 'accepted'
      })

      if (res.status === 200) {
        // showToast('Custom order accepted', 'success')
        // queryClient.invalidateQueries('customOrder')
        const items = order?.cart_id?.items?.map((product) => ({
          name: product?.name,
          _id: product?._id,
          price: product?.price,
          quantity: product?.quantity,
          total_price: product?.total_price,
          image: product?.product_id?.images[0],
          product_id: {
            _id: product?.product_id?._id,
          },
          shop_id: {
            _id: product?.shop_id?._id,
          },
          product_varient: product?.product_varient,
          ordered: true,
          order_date: new Date()
        }));

        const cartItems = {
          user_id: userId,
          items: items,
          total_price: items.reduce((acc, item) => acc + item.total_price + Number(tax), 0),
          // total_price: Number(subtotal) + Number(tax),
          comment: comment ? comment : "",
          sub_total: items.reduce((acc, item) => acc + item.total_price, 0),
          shipping: 0,
          tax: tax,
          discount: 0,
          // estimation = current date + 3 days
          estimation_date: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000),
          creation_date: new Date()
        }
        setCartItemAtom(cartItems)
        navigate('/delivery')
      } else {
        showToast('Error on accepting custom order', 'error')
      }
    } catch (error) {
      showToast('Error on accepting custom order', 'error')
    }
  }

  // handleDeclineCustomOrder for declining custom order
  const handleDeclineCustomOrder = async (id) => {
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_PATH}/custom-orders/update/${id}`, {
        status: 'canceled'
      })

      if (res.status === 200) {
        showToast('Custom order declined', 'success')
        queryClient.invalidateQueries('customOrder')
      } else {
        showToast('Error on declining custom order', 'error')
      }
    } catch (error) {
      showToast('Error on declining custom order', 'error')
    }

  }
  const CustomOrderComponent = () => {
    return (
      <>
        {
          customOrders?.length > 0 && customOrders?.map((order) => (
            <div className='flex justify-between items-center flex-wrap gap-2'>
              <p className='text-md'>Vendor {order?.vendor_id?.firstname} sent you a custom order </p>
              <div className='flex gap-3 flex-wrap'>
                <button
                  onClick={() => handleAcceptCustomOrder(order._id, order)}
                  className='bg-green-500 text-primary-text-color px-3 py-1 rounded-md'>
                  Accept
                </button>
                <button
                  onClick={() => handleDeclineCustomOrder(order._id)}
                  className='bg-gray-500 text-primary-text-color px-3 py-1 rounded-md'>
                  Decline
                </button>
                <button
                  onClick={() => handleDeclineCustomOrder(order._id)}
                  className='bg-red-600 text-primary-text-color px-3 py-1 rounded-md'>
                  Decline and Report for spam
                </button>
              </div>
            </div>
          ))
        }
      </>
    )
  }

  return (
    <div className='h-full p-3 font-main max-w-7xl mx-auto'>
      <Stepper activeStep={0} />
      {/* cart list and payment info */}
      <div className='grid grid-cols-1 md:grid-cols-6 gap-4'>
        {/* all cart items */}
        <div className='col-span-1 md:col-span-4 space-y-5'>
          <CustomOrderComponent />
          {
            (cartProducts?.items.length == 0 && customOrders?.length == 0) &&
            <div className="flex flex-col items-center justify-center py-12 md:py-16 gap-4 md:gap-8">
              <div className="flex flex-col items-center justify-center gap-4 md:gap-8 text-center">
                <div className="flex flex-col items-center gap-2">
                  <ShoppingCartIcon className="w-14 h-14 animate-bounce text-secondary-text-color" />
                  <div className="text-3xl font-semibold text-green-600">Your cart is feeling lonely</div>
                  <div className="text-base max-w-[400px] dark:text-navy-400 mt-2 text-secondary-text-color">
                    It seems your cart is empty. Let's fill it up with some amazing products!
                  </div>
                </div>
                <p
                  onClick={() => {
                    navigate('/product-catalog')
                  }}
                  className="mx-auto md:mx-0 bg-green-600 hover:bg-green-700 text-primary-text-color py-1 px-2 rounded-sm cursor-pointer"
                >Explore Products</p>
              </div>
            </div>
          }
          {cartProducts?.items?.map((product) => (
            <div key={product._id}
              className={`flex justify-between items-start rounded-lg relative flex-wrap md:flex-nowrap hover:cursor-pointer shadow-sm hover:shadow-md`}
              onClick={(e) => {
                // do not select product if user clicks on the plus or minus button
                if (e.target.tagName === 'svg') {
                  return;
                }

                handleProductSelect(product)
              }}
              // style={{
              //   boxShadow: '0px 1.2558139562606812px 3.767441749572754px 0px #03004717'
              // }}
            >
              <div className='flex gap-3 flex-wrap md:flex-nowrap w-full'>
                <img src={product?.product_id?.images[0] || 'default_image_url'} alt={product.name.en} className='w-full md:w-[180px] h-[145px] -ms-1 object-cover md:rounded-s-[10px] rounded-[10px]' />
                <div className='flex flex-col justify-between items-stretch my-3 text-[18px]'>
                  <p className='text-gray-900 font-[400]'>{product.name.en}
                    {/* select badge */}
                    {selectedProducts.some((selectedProduct) => selectedProduct._id === product._id) && <span className='text-[10px] rounded-full border-[1px] py-1 px-3 ms-4 font-[700] bg-green-600 text-white'>Selected</span>}
                  </p>
                  <div className='flex gap-3'>
                    <p className='text-gray-500 font-[400]'>${product.price.toFixed(2)}</p>
                    <p className='text-gray-500 font-[400]'>x {product.quantity}</p>
                    <p className='text-green-600 font-[400]'>${(product.price * product.quantity).toFixed(2)}</p>
                  </div>
                </div>
              </div>
              <div className='items-center justify-center gap-4 self-end p-3 flex'>
                {/* minus button */}
                <LuMinus
                  onClick={() => {
                    if (product.quantity == 1) return;
                    // if selected product is already in the cart, do not add it again
                    if (selectedProducts.some((selectedProduct) => selectedProduct._id === product._id)) {
                      // deselect the product
                      setSelectedProducts([])
                      handleProductSelect(product)
                    }
                    handleUpdateCart(product._id, product.quantity - 1, product.total_price - product.price)()
                  }}
                  className='w-7 h-7 border-green-200 border-2 text-green-500 p-1 rounded-[3px] cursor-pointer hover:text-primary-text-color hover:bg-green-500 transition-colors' />
                <p>{product?.quantity}</p>
                <FiPlus
                  onClick={() => {
                    // if selected product is already in the cart, do not add it again
                    if (selectedProducts.some((selectedProduct) => selectedProduct._id === product._id)) {
                      // deselect the product
                      setSelectedProducts([])
                      handleProductSelect(product)
                    }
                    handleUpdateCart(product._id, product.quantity + 1, product.total_price + product.price)()
                  }}
                  className='w-7 h-7 border-green-200 border-2 text-green-500 p-1 rounded-[3px] cursor-pointer hover:text-primary-text-color hover:bg-green-500 transition-colors'
                />
                <RxCross2
                  onClick={handleRemoveFromCart(product._id)}
                  className='absolute top-2 right-4 w-6 h-6 cursor-pointer transition bg-white rounded-full p-1 hover:bg-red-600 hover:text-white'
                />
              </div>
            </div>
          ))}
          {
            cartProducts?.items.length !== 0 && <button
              className='bg-green-600 text-primary-text-color w-full py-2 rounded-md hover:bg-green-500 transition'
              onClick={handleCartSelect}
            >
              Next - Delivery address
            </button>
          }

        </div>


        {/* payment info */}
        <div className="col-span-1 md:col-span-2 mt-4 md:mt-0">
          <div className='flex flex-col gap-3 mdLp-7 '>
            {/* subtotal */}
            <div className='flex justify-between md:text-[18px]'>
              <p className='text-gray-500'>Subtotal : </p>
              <p className='text-black font-[600]'>${parseFloat(subtotal)?.toFixed(2)}</p>
            </div>
            {/* shipping */}
            <div className='flex justify-between md:text-[18px]'>
              <p className='text-gray-500'>Shipping : </p>
              <p className='text-black font-[600]'>-</p>
            </div>
            {/* tax */}
            <div className='flex justify-between md:text-[18px]'>
              <p className='text-gray-500'>Tax : </p>
              <p className='text-black font-[600]'>${tax}</p>
            </div>
            {/* discount */}
            <div className='flex justify-between md:text-[18px]'>
              <p className='text-gray-500'>Discount : </p>
              <p className='text-black font-[600]'>- </p>
            </div>
            <hr className='w-full bg-gray-200 h-[2px]' />
            {/* total */}
            <div className='flex justify-between md:text-[18px]'>
              <p className='text-black font-[600]'>Total : </p>
              <p className='text-black font-[600]'>${(parseFloat(subtotal) + parseFloat(subtotal * 0.01)).toFixed(2)}</p>
            </div>
            <hr className='w-full bg-gray-200 h-[2px]' />
            <p className='text-gray-500'>Additional Comments </p>
            {/* comments */}
            <textarea
              cols="30"
              rows="5"
              onChange={e => setComment(e.target.value)}
              className='border-gray-200 border-2 rounded-lg outline-none p-2'
            ></textarea>
            <hr className='w-full bg-gray-200 h-[2px]' />
            {/* shippiing estimation */}
            <p className='text-black font-[600]'>Shipping Estimates</p>
            <p>Here will be country, state and zip from partners api</p>
          </div>
        </div>
      </div>
    </div>
  )
}



function ShoppingCartIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  )
}

export default Cart