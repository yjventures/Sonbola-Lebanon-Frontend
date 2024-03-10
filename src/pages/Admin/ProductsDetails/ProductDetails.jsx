import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import shirt from 'assets/global/product/shirt.png'
import ReactStars from 'react-stars'
import { IoBagHandleOutline } from "react-icons/io5";
import { CiHeart } from "react-icons/ci";
import { FaCodeCompare } from "react-icons/fa6";
import { IoShareSocial } from "react-icons/io5";
import { LiaTruckMovingSolid } from "react-icons/lia";
import { GoGift } from "react-icons/go";
import { MdOutlineDone } from "react-icons/md";
import tShirt from 'assets/global/product/t-shirt.png'
import { FaEye } from "react-icons/fa";
import BottomAdvertisement from 'src/components/Common/BottomAdvertisement/BottomAdvertisement';
import { useQuery } from '@tanstack/react-query';
import { useSetAtom } from 'jotai';
import { newProductAtom } from 'src/lib/jotai';
import axios from 'axios';
import { VscSend } from "react-icons/vsc";
import { GoGitPullRequestDraft } from "react-icons/go";
import { MdOutlineEdit } from "react-icons/md";
import { showToast } from 'src/components/Common/Toastify/Toastify';
import Spinner from 'src/components/Signup/Spinner';
import { BsBackspace, BsBackspaceReverse } from 'react-icons/bs';


const ProductDetails = () => {
  const { id } = useParams()
  const newProduct = useSetAtom(newProductAtom)
  const navigate = useNavigate()
  const user = JSON.parse(localStorage.getItem('user'))
  // fetch product by id
  const { isPending, data: product, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await fetch(`${import.meta.env.VITE_API_PATH}/products/product/${id}`)
      // console.log(response)
      const result = await response.json();
      return result?.productInfo;

    }
  })
  // console.log(product?._id)

  const [quantity, setQuantity] = useState(1);
  const [isLoadingCart, setIsLoadingCart] = useState(false);

  // plus product count
  const handleAddProductCount = () => {
    setQuantity(quantity + 1)
  }
  // minus product count
  const handleMinusProductCount = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const tabs = [
    { name: 'Description', current: true },
    { name: 'Additional Information', current: false },
    { name: 'Review (1)', current: false },
    { name: 'Questions', current: false },
    { name: 'About Vendor', current: false },
  ]
  const [selectedTab, setSelectedTab] = useState(tabs.find((tab) => tab.current).name);


  const [selectedImage, setSelectedImage] = useState(product?.images[0]);

  const handleTabClick = (tabName) => {
    setSelectedTab(tabName);
  };
  const handleTabChange = (event) => {
    setSelectedTab(event.target.value);
  };

  const handleSaveDraft = async () => {
    // Save the product to the database
    const data = {
      'is_published': false,
      'draft': true,
    };

    const res = await axios.put(`${import.meta.env.VITE_API_PATH}/products/update/${id}`, data, {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
      }
    })
    if (res.status === 200) {
      showToast('Product drafted successfully', 'success')
      navigate('/vendor-products')
    } else {
      showToast('Error adding product, try again', 'error')
    }
  }

  const handlePublishProduct = async () => {
    // Save the product to the database
    const data = {
      'is_published': true,
    }

    const res = await axios.put(`${import.meta.env.VITE_API_PATH}/products/update/${id}`, data, {
      headers: {
        Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
      }
    })
    if (res.status === 200) {
      showToast('Product published successfully', 'success')
      navigate('/vendor-products')
    } else {
      showToast('Error adding product, try again', 'error')
    }
  }


  // console.log(product)
  const fetchProductById = async (productId) => {
    const response = await fetch(`${import.meta.env.VITE_API_PATH}/products/product/${productId}`);
    const result = await response.json();
    return result?.productInfo;
  };

  // Inside your component
  const RelatedProducts = ({ product }) => {
    const relatedProductIds = product?.related_products || [];

    // Fetch related products using separate useQuery calls
    const relatedProductsQueries = relatedProductIds.map((productId) => {
      return useQuery({
        queryKey: ['product', productId],
        queryFn: () => fetchProductById(productId),
      });
    });

    // Extract data and error from each query result
    const relatedProductsData = relatedProductsQueries.map((query) => query.data);
    const relatedProductsError = relatedProductsQueries.find((query) => query.error);

    return (
      <div>
        {relatedProductsQueries.some((query) => query.isFetching) && <p>Loading...</p>}
        {relatedProductsError && <p>Error: {relatedProductsError?.message}</p>}
        {relatedProductsData.length > 0 && (
          <div className='grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-5'>
            {relatedProductsData.map((item, index) => {
              // Render your related product component here
              console.log(item)
              return (
                // <div key={index} className='relative border border-gray-100 p-4 flex flex-col items-center gap-3 hover:border-gray-500 w-[232px] rounded-md mx-auto'>
                //     <div className='w-[150px] h-[150px]  flex justify-center items-center rounded-md cursor-pointer'>
                //         <img src={item.images[0]} alt="image" className='w-[120px] h-[145px] rounded-md object-cover' />
                //     </div>
                // </div>
                <div key={index} className='relative border border-gray-100 p-4 flex flex-col items-center gap-3 hover:border-gray-500 w-[232px] rounded-md mx-auto'>
                  <div className='  flex justify-center items-center rounded-md cursor-pointer'>
                    <img src={item?.images[0]} alt="image" className='w-full h-[150px]  rounded-md' />
                  </div>
                  {/* view and wishlist button */}
                  <div className='flex justify-center gap-3 flex-col absolute right-3 top-2'>
                    {/* view icon */}
                    <div
                      style={{
                        // drop shadow
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)'
                      }}
                      className='w-[30px] h-[30px] rounded-full cursor-pointer flex justify-center items-center'>
                      <FaEye className='text-gray-400' />
                    </div>
                    {/* wishlist icon */}
                    <div
                      style={{
                        // drop shadow
                        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.1)'
                      }}
                      className='w-[30px] h-[30px] rounded-full cursor-pointer flex justify-center items-center'>
                      <CiHeart className='text-gray-700' />
                    </div>
                  </div>
                  {/* name and price */}
                  <p className='text-[16px] font-[600] text-[#2B3445] mt-10 text-center'>{item?.name.en}</p>
                  <p className='text-[16px] font-[600] text-[#1A985B]'>{item?.price}</p>

                  <div className='flex items-center gap-1'>
                    <ReactStars
                      count={5}
                      value={item?.rating}
                      edit={false}
                      size={24}
                      color2={'#ffd700'}
                    />
                    <span className='gray-800 ms-3 mt-1'>({item?.reviews?.length})</span>
                  </div>
                  {/* add to cart */}
                  <div className='w-full' >
                    <div className='border border-gray-200 py-2 flex justify-center gap-2 items-center rounded-md cursor-pointer hover:bg-black hover:text-primary-text-color transition'>
                      <p className='text-[16px] font-[600]'>Add to Cart</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
        }
      </div>
    );
  };


  function classNames(...classes) {
    return classes.filter(Boolean).join(' ')
  }
  const [isView, setIsView] = useState(false)
  // use url params to get isView value
  const urlSearchParams = new URLSearchParams(window.location.search);
  const params = Object.fromEntries(urlSearchParams.entries());

  useEffect(() => {
    if (params.isView == 'true') {
      setIsView(true)
      setSelectedImage(product?.images[0])
    }
    setSelectedImage(product?.images[0])
  }, [params, urlSearchParams])

  // console.log(product)

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
        showToast('Product added to wishlist', 'success')
      } else {
        showToast('Error adding product to wishlist', 'error')
      }

    } catch (error) {
      showToast('Error adding product to wishlist', 'error')
    }
  }

  // add to cart
  const handleAddToCart = async () => {
    setIsLoadingCart(true)
    const productName = product?.name;
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
          quantity: quantity,
          price: product.on_sale ? product?.sales_price : product?.price,
          total_price: product.on_sale ? product?.sales_price * quantity : product?.price * quantity,
          shop_id: shopId
        },
        "comment": ""
      })
      if (response.status === 200) {
        showToast('Product added to cart', 'info')
      } else {
        showToast('Something went wrong', 'error')
      }
    } catch (error) {
      console.log('Catched error', error)
    }
    setIsLoadingCart(false)
  }


  return (
    <div className='max-w-7xl mx-auto p-3 font-main md:mt-[60px] mt-[30px]'>
      {
        isPending ? <p>Loading...</p> :
          <>
            {
              isView == true && (
                <div className='w-full flex justify-start gap-3 mb-6'>
                  <button
                    onClick={() => {
                      handlePublishProduct()
                      navigate('/new-product')
                    }}
                    className='bg-blue-500 text-primary-text-color px-6 py-2 rounded-sm hover:bg-black transition flex items-center justify-center gap-2'
                  >
                    Publish
                    <VscSend />
                  </button>
                  {/* draft button */}
                  <button
                    onClick={handleSaveDraft}
                    className='bg-blue-500 text-primary-text-color px-6 py-2 rounded-sm hover:bg-black transition flex items-center justify-center gap-2'
                  >
                    Make Draft
                    <GoGitPullRequestDraft />
                  </button>
                  {/* edit button */}
                  <button
                    onClick={() => {
                      newProduct(product)
                      navigate('/new-product')
                    }}
                    className='bg-blue-500 text-primary-text-color px-6 py-2 rounded-sm hover:bg-black transition flex items-center justify-center gap-2'
                  >
                    Edit Product
                    <MdOutlineEdit />
                  </button>
                </div>
              )
            }
            {/* back button */}
            <div className='inline-flex items-center gap-3 ms-10 mb-2 cursor-pointer'
              onClick={() => navigate(-1)}>
              <button
                className='p-2 rounded-md hover:bg-gray-200 transition'>
                <BsBackspace />
              </button>
              <p className='text-[16px] font-[600] text-gray-900'>Back to Products</p>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-2 gap-7'>
              <div className='grid grid-cols-6'>
                {/* All image preview part*/}
                <div className='col-span-2 flex flex-col items-center gap-5'>
                  {/* Map over product images */}
                  {product?.images?.map((image, index) => (
                    <div key={index}
                      onClick={() => setSelectedImage(image)}
                      className='w-[126px] h-[126px] p-1 focus:ring-1 border-[1px] border-gray-200 flex justify-center items-center rounded-md cursor-pointer hover:bg-gray-100 transition'
                    >
                      <img src={image} alt={`Image ${index + 1}`} className='w-full h-full rounded-md object-cover p-[1px]' />
                    </div>
                  ))}
                </div>
                {/*selected image list part */}
                <div className='col-span-4 flex justify-center items-center border-[1px] relative max-h-[600px] rounded-md'>
                  {/* arrow button for sliding */}
                  <div className='absolute top-1/2 -left-4 transform -translate-y-1/2'>
                    <button className='bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition'>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                  </div>

                  <p className='absolute top-3 left-3 bg-[#1A985B] px-3 py-1 text-primary-text-color rounded-md'>
                    20% off
                  </p>
                  <img src={selectedImage} alt="image" className='w-full h-full object-cover rounded-md' />
                  {/* arrow button for sliding */}
                  <div className='absolute top-1/2 -right-4 transform -translate-y-1/2'>
                    <button className='bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition'>
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              {/* product details part */}
              <div>
                <p className='font-[700] text-[26px]'>{product?.name && product?.name?.en}</p>
                {/* Brand | Rating | Code */}
                <div className='mt-[16px] gap-3 flex justify-start items-center flex-wrap'>
                  <p className='text-[16px]'><span className='font-[600] text-gray-500'>Brand</span> : <span className='gray-800mx-1'>{product?.brand && product?.brand}</span></p>
                  <div className='border-x-2 px-3 border-gray-400 h-[20px] flex items-center'>
                    <p className='text-[16px] flex items-center '>
                      <ReactStars
                        count={5}
                        value={4}
                        edit={false}
                        size={24}
                        color2={'#ffd700'}
                      />
                      <span className='gray-800 ms-3 mt-1'>(50)</span>
                    </p>
                  </div>
                  <div>
                    <p className='text-[16px]'><span className='font-[600] text-gray-500'>Code </span> : <span className='gray-800 mx-1'>{product?.sku && product?.sku}</span></p>
                  </div>
                </div>
                {/* Amount and discount */}
                {
                  product?.sales_price ?
                    <div className='flex items-center gap-3 mt-[24px]'>
                      {product?.sales_price && <p className='text-[32px] font-[700] text-[#1A985B]'>{product?.sales_price * quantity} USD</p>}
                      <p className='text-[20px] font-[700] line-through text-gray-400 mt-1'>{product?.price * quantity} USD</p>

                    </div> : <div className='flex items-center gap-3 mt-[24px]'>
                      <p className='text-[32px] font-[700] text-[#1A985B]'>{product?.price * quantity} USD</p>
                      {product?.sales_price && <p className='text-[20px] font-[700] line-through text-gray-400 mt-1'>{product?.sales_price * quantity} USD</p>}
                    </div>
                }

                {/* In stock tag */}
                <div className='my-2'>
                  {product?.quantity > 0 ?
                    <span className='text-[#33D067] bg-green-200 px-2 py-1 rounded-sm mt-2 w-24 flex justify-center items-center '>
                      IN STOCK
                    </span> : <span className='red-500 bg-red-200 px-2 py-1 rounded-sm mt-2 w-24 flex justify-center items-center'>
                      OUT OF STOCK
                    </span>
                  }
                </div>

                {
                  product?.allow_bulk == true && product?.bulk_prices?.length > 0 && (
                    <div className='overflow-scroll my-[27px] flex justify-start ' style={{ scrollbarWidth: 'none' }}>
                      {
                        product?.bulk_prices?.map((item, index) => (
                          <div key={index} className='flex items-start gap-2 flex-col justify-start min-w-[150px]'>
                            <p className='text-[14px] font-[600] text-[#0E3D56] ms-2'> {item?.low_range} - {item.high_range} Items </p>
                            <p className='text-[30px] font-[700] text-[#2B3445] ms-2'> {item?.price} USD</p>
                          </div>
                        ))
                      }
                    </div>
                  )
                }
                {/* description */}
                <p className='text-[14px] text-gray-900 font-[600]'>
                  {product?.description && product?.description.en}
                </p>
                {/* size */}
                {
                  product?.variations && product?.variations.length > 0 && (
                    <div className='mt-[27px]'>
                      <p className='text-[16px] font-[600] text-gray-900'>Size : XL</p>
                      <div className='flex items-center gap-3 mt-2'>
                        <div className='border border-gray-100 w-[40px] h-[40px] flex justify-center items-center rounded-md cursor-pointer hover:bg-gray-100'>
                          <p className='text-[16px] font-[600] text-gray-900'>S</p>
                        </div>
                        <div className='border border-gray-100 w-[40px] h-[40px] flex justify-center items-center rounded-md cursor-pointer hover:bg-gray-100'>
                          <p className='text-[16px] font-[600] text-gray-900'>M</p>
                        </div>
                        <div className='border border-gray-100 w-[40px] h-[40px] flex justify-center items-center rounded-md cursor-pointer hover:bg-gray-100'>
                          <p className='text-[16px] font-[600] text-gray-900'>L</p>
                        </div>
                        <div className='border border-gray-100 w-[40px] h-[40px] flex justify-center items-center rounded-md cursor-pointer bg-gray-700 text-primary-text-color'>
                          <p className='text-[16px] font-[600]'>XL</p>
                        </div>
                        <div className='border border-gray-100 w-[40px] h-[40px] flex justify-center items-center rounded-md cursor-pointer hover:bg-gray-100 '>
                          <p className='text-[16px] font-[600] text-gray-900'>XXL</p>
                        </div>
                      </div>
                    </div>
                  )
                }

                <p className='bg-gray-200 text-center py-1 mt-4'>
                  You cannot add product to cart
                </p>


                {/* hr line */}
                <div className='border-b border-gray-200 my-8'></div>
                {/* estimated delivery and returns */}
                <div className='flex items-center gap-3'>
                  <p className='text-[16px] font-[600] text-gray-900 flex items-center gap-3'><LiaTruckMovingSolid className='text-gray-700' /> Estimated Delivery : </p>
                  <p className='text-[16px] font-[600] text-gray-500'>24 - 30 August, 2022</p>
                </div>
                {/* returns */}
                <div className='flex items-center gap-3 my-3'>
                  <p className='text-[16px] font-[600] text-gray-900 flex items-center gap-3'><GoGift className='text-gray-700' /> Free Shipping & Returns : </p>
                  <p className='text-[16px] font-[600] text-gray-500'>Orders over 300.00 USD</p>
                </div>
                {/* we accept payments */}
                <div className='flex items-center gap-3 mt-6 bg-gray-100 justify-center py-2 rounded-sm'>
                  <p className='text-[16px] font-[600] text-gray-900 flex items-center gap-3'>We Accept - Visa | Stripe | PayPal</p>
                  {/* <img src="https://www.paypalobjects.com/webstatic/mktg/logo/AM_mc_vs_dc_ae.jpg" alt="paypal" className='w-[100px] h-[30px] object-contain' /> */}

                </div>
              </div>
              {/* description, reviews, additional info etc tabs */}
              <div className='w-full flex flex-col'>
                <div className="sm:hidden">
                  <label htmlFor="tabs" className="sr-only">
                    Select a tab
                  </label>
                  {/* Use an "onChange" listener to update the selected tab state. */}
                  <select
                    id="tabs"
                    name="tabs"
                    className="block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                    value={selectedTab}
                    onChange={handleTabChange}
                  >
                    {tabs.map((tab) => (
                      <option key={tab.name} value={tab.name}>
                        {tab.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="hidden md:block">
                  <div className="border-b border-gray-200 w-full">
                    <nav className="-mb-px flex " aria-label="Tabs">
                      {tabs.map((tab) => (
                        <p
                          key={tab.name}
                          onClick={() => handleTabClick(tab.name)}
                          className={classNames(
                            tab.name == selectedTab
                              ? 'border-black text-black'
                              : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700',
                            'whitespace-nowrap border-b-2 py-4 text-sm font-medium cursor-pointer px-10'
                          )}
                          aria-current={tab.current ? 'page' : undefined}
                        >
                          {tab.name}
                        </p>
                      ))}
                    </nav>
                  </div>
                </div>
              </div>
            </div>
            <div className='w-full md:p-6 p-2'>
              {/* Conditionally render content based on the selected tab */}
              {selectedTab === 'Description' ? (
                <>
                  <p className='text-[#4B566B] font-[600]'>
                    The easiest test is to simply touch it. A good quality Shirt will never feel like plastic or chunky. If the fabric feels soft but firm at the same time, then chances are that it is good quality material. Cloth is fabric which is made by weaving or knitting a substance such as cotton, wool, silk, or nylon. Cloth is used especially for making clothes. She began cleaning the wound with a piece of cloth. clothes. Synonyms: fabric, material, textiles, dry goods More Synonyms of cloth.
                  </p>
                  {/* qualities */}
                  <div className='flex mt-6 md:gap-10'>
                    <ul className='list-none list-inside text-[16px] font-[500]'>
                      <li className='text-[#4B566B] my-2 flex items-center gap-2 '>
                        <MdOutlineDone />
                        100% Cotton Febric.
                      </li>
                      <li className='text-[#4B566B] my-2 flex items-center gap-2 '>
                        <MdOutlineDone />
                        Comfortable Fittings.
                      </li>
                      <li className='text-[#4B566B] my-2 flex items-center gap-2 '>
                        <MdOutlineDone />
                        Made in Italy.
                      </li>
                      <li className='text-[#4B566B] my-2 flex items-center gap-2 '>
                        <MdOutlineDone />
                        Button closure.
                      </li>
                      <li className='text-[#4B566B] my-2 flex items-center gap-2 '>
                        <MdOutlineDone />
                        Machine Wash.
                      </li>
                    </ul>
                    <ul className='list-none list-inside text-[16px] font-[500]'>
                      <li className='text-[#4B566B] my-2 flex items-center gap-2 '>
                        <MdOutlineDone />
                        100% Cotton Febric.
                      </li>
                      <li className='text-[#4B566B] my-2 flex items-center gap-2 '>
                        <MdOutlineDone />
                        Comfortable Fittings.
                      </li>
                      <li className='text-[#4B566B] my-2 flex items-center gap-2 '>
                        <MdOutlineDone />
                        Made in Italy.
                      </li>
                      <li className='text-[#4B566B] my-2 flex items-center gap-2 '>
                        <MdOutlineDone />
                        Button closure.
                      </li>
                      <li className='text-[#4B566B] my-2 flex items-center gap-2 '>
                        <MdOutlineDone />
                        Machine Wash.
                      </li>
                    </ul>

                  </div>
                </>
              ) : selectedTab === 'Additional Information' ? (
                <div>
                  Additional Information
                </div>
              ) : selectedTab === 'Questions' ? (
                <div>
                  Questions data
                </div>
              ) : selectedTab === 'About Vendor' ? (
                <div>
                  Vendor data
                </div>
              ) : (
                <div>
                  Reviews data
                </div>
              )}


            </div>
            {
              isView == !true && <>

                {/* related products */}

                {
                  product?.related_products.length > 0 && <p className='text-[#2B3445] font-[700] text-[24px] mb-[30px]'>Related Products</p>
                }
                <RelatedProducts product={product} />

                <BottomAdvertisement />
              </>
            }

          </>
      }

    </div >
  )
}

export default ProductDetails