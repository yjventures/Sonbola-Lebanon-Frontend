import React, { useEffect, useRef, useState } from 'react'
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
import { cartItemsAtom, newProductAtom } from 'src/lib/jotai';
import axios from 'axios';
import { VscSend } from "react-icons/vsc";
import { GoGitPullRequestDraft } from "react-icons/go";
import { MdOutlineEdit } from "react-icons/md";
import { showToast } from 'src/components/Common/Toastify/Toastify';
import Spinner from 'src/components/Signup/Spinner';
import { CiCalendarDate } from "react-icons/ci";
import { RxAvatar } from "react-icons/rx";
import Sideover from 'src/components/User/Cart/Sideover/Sideover';
import { basicColors } from 'src/lib/helper/basicColors';


const Products = () => {
    const { id } = useParams()
    const setCartItemAtom = useSetAtom(cartItemsAtom)
    const newProduct = useSetAtom(newProductAtom)
    const navigate = useNavigate()
    const user = JSON.parse(localStorage.getItem('user'))
    const [open, setOpen] = useState(false)
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
    const [quantity, setQuantity] = useState(1);
    const [isLoadingCart, setIsLoadingCart] = useState(false);


    const { isPending: reviewPending, isError: reviewError, data: reviewData } = useQuery({
        queryKey: ['product_review', id],
        queryFn: async () => {
            const response = await fetch(`${import.meta.env.VITE_API_PATH}/reviews/get-all?product_id=${id}`)
            const result = await response.json();
            return result;
        }

    })

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
        { name: `Reviews (${reviewData?.reviews?.length})`, current: false },
        { name: 'Questions', current: false },
        { name: 'About Vendor', current: false },
    ]
    const [selectedTab, setSelectedTab] = useState(tabs.find((tab) => tab.current).name);


    const [selectedImage, setSelectedImage] = useState('');
    const [selectedAttributes, setSelectedAttributes] = useState({});

    const [selectedVariationDetails, setSelectedVariationDetails] = useState({
        name: null,
        description: null,
        images: null,
        _id: null,
        on_sale: null,
        sales_price: null,
        price: null,
    });
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
                                    <p className='text-[16px] font-[600] text-secondary-text-color mt-10 text-center'>{item?.name.en}</p>
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
        }
    }, [params, urlSearchParams])

    useEffect(() => {
        // Check if product.images array exists and has at least one image
        if (product?.images?.length > 0) {
            setSelectedImage(product?.images[0]);
        }

        if (selectedVariationDetails) {
            if (selectedVariationDetails?.images?.length > 0) {
                // console.log()
                setSelectedImage(selectedVariationDetails?.images[0]);
            } else {
                setSelectedImage(product?.images[0]);
            }
        }

    }, [product, selectedVariationDetails]);

    const token = JSON.parse(localStorage.getItem('token'))
    const handleAddtoWishlist = async (productId) => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_PATH}/wishlists/add-product/${user?._id}`, {
                product: productId,
            }, {
                headers: {
                    Authorization: `Bearer ${token.accessToken}`
                }
            })

            console.log(response.data)
            if (response.status == 200) {
                showToast('Product added to wishlist', 'success')
            } else {
                showToast('Error adding product to wishlist', 'error')
            }

        } catch (error) {
            showToast('Somwething went wrong', 'error')
            console.error(error)
        }
    }

    // add to cart
    const handleAddToCart = async () => {
        setIsLoadingCart(true)

        const productName = selectedVariationDetails?.name ? selectedVariationDetails.name.en : product?.name?.en;
        const productId = product?._id;
        const shopId = product?.shop;
        // For price, check if selectedVariationDetails is defined and has an on_sale property
        const price = selectedVariationDetails && selectedVariationDetails.on_sale ? selectedVariationDetails.sales_price : product?.price;
        const total_price = price * quantity;
        const product_varient = selectedVariationDetails._id;
        // console.log(productName)
        // console.log(productId)
        // console.log(shopId)
        // console.log(price, 'price')
        // console.log(total_price, 'total price');
        // return
        const userId = JSON.parse(localStorage.getItem('user'))?._id
        // add product to cart
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_PATH}/carts/add-product/${userId}`, {
                product_item: {
                    name: productName,
                    product_id: productId,
                    quantity: quantity,
                    price: price,
                    total_price: total_price,
                    shop_id: shopId,
                    product_varient: product_varient
                },
                "comment": ""
            })
            if (response.status === 200) {
                console.log('Product added to cart', 'info')
            } else {
                showToast('Something went wrong', 'error')
            }
        } catch (error) {
            console.log('Catched error', error)
        }
        setOpen(true)
        setIsLoadingCart(false)
    }


    //  set attributes
    useEffect(() => {
        // Initialize selectedAttributes with the first option of each attribute
        const initialAttributes = {};
        product?.variations?.forEach(variation => {
            variation.attributes.forEach(attr => {
                if (!initialAttributes[attr.attribute]) {
                    initialAttributes[attr.attribute] = attr.value;
                }
            });
        });
        setSelectedAttributes(initialAttributes);
    }, [product?.variations]);

    const handleAttributeChange = (attribute, value) => {
        setSelectedAttributes(prev => ({ ...prev, [attribute]: value }));
    };

    // console.log(selectedAttributes, 'attributes')
    // console.log(selectedVariationDetails, 'variation')
    const handleSelectVariation = () => {
        const matchingVariation = product?.variations?.find(variation => {
            // Check if every selected attribute matches the variation's attributes
            return Object.entries(selectedAttributes).every(([attribute, value]) => {
                // Find the attribute in the variation's attributes array
                const varAttr = variation.attributes.find(attr => attr.attribute === attribute);
                // Return true if the attribute exists and its value matches the selected value
                return varAttr && varAttr.value === value;
            });
        });

        // console.log(matchingVariation, 'matched')
        if (matchingVariation) {
            // Update the selected variation details
            setSelectedVariationDetails({
                name: matchingVariation.name || product?.name?.en, // Fallback to product name if variation name is not available
                description: matchingVariation.description || product?.description?.en, // Fallback to product description if variation description is not available
                images: matchingVariation?.images || product?.images, // Fallback to the first product image if variation images are not available
                _id: matchingVariation._id || product?._id,
                on_sale: matchingVariation.on_sale || product?.on_sale,
                sales_price: matchingVariation.sales_price || product?.sales_price,
                price: matchingVariation.price || product?.price
            });
        }
    };

    // Trigger handleSelectVariation whenever selectedAttributes changes
    useEffect(() => {
        handleSelectVariation();
    }, [selectedAttributes]);
    // console.log(selectedVariationDetails, 'variation')
    // Group variations by attribute for display

    const renderVariationOptions = () => {
        const attributesGroup = product?.variations?.reduce((acc, variation) => {
            variation?.attributes?.forEach(attr => {
                if (!acc[attr?.attribute]) {
                    acc[attr?.attribute] = new Set();
                }
                acc[attr?.attribute]?.add(attr.value);
            });
            return acc;
        }, {});

        const getColorHex = (colorName) => {
            // Split the input color name into words for case-insensitive comparison
            const colorNameWords = colorName?.toLowerCase()?.split(/\s+/);
            // Find a color in the basicColors array that includes at least one of the words in colorNameWords
            const color = basicColors.find(c =>
                colorNameWords?.some(word =>
                    c?.name?.toLowerCase().split(/\s+/).includes(word)
                )
            );
            // Return the hex value if a matching color is found, otherwise return null
            return color ? color.hex : null;
        };

        return Object.entries(attributesGroup).map(([attribute, values]) => (
            <div key={attribute} className='mt-[20px]'>
                <p className='text-[16px] font-[600] text-secondary-text-color'>
                    {attribute}: <span className='text-[#1A985B] ms-2'>{selectedAttributes[attribute]}</span>
                </p>
                <div className='flex items-center gap-3 mt-2'>
                    {Array.from(values).map(value => {
                        const isColorAttribute = attribute.toLowerCase() === 'color' || attribute.toLowerCase() === 'colors';
                        if (isColorAttribute) {
                            const colorHex = getColorHex(value); // Get hex value for the color
                            return (
                                <div
                                    key={value}
                                    onClick={() => handleAttributeChange(attribute, value)}
                                    className={`outline-none w-6 h-6 rounded-full px-4 flex justify-center items-center cursor-pointer outline ${selectedAttributes[attribute] === value ? ' outline-gray-300' : 'outline-gray-100'}`}
                                    style={{ backgroundColor: colorHex || value, width: '24px', height: '24px', borderRadius: '50%' }}
                                ></div>
                            );
                        } else {
                            return (
                                <div
                                    key={value}
                                    onClick={() => handleAttributeChange(attribute, value)}
                                    className={`border border-gray-100 outline-none h-[40px] px-4 flex justify-center items-center rounded-md cursor-pointer  ${selectedAttributes[attribute] === value ? 'bg-secondary-color text-primary-text-color ' : 'bg-primary-color text-secondary-text-color'}`}
                                >
                                    <p className='text-[16px] font-[600]'>{value}</p>
                                </div>
                            );
                        }
                    })}
                </div>
            </div>
        ));
    };
    const findCurrentImageIndex = () => {
        const images = selectedVariationDetails?.images?.length > 0 ? selectedVariationDetails.images : product?.images;
        return images.findIndex(image => image === selectedImage);
    };

    // Function to handle left arrow click (previous image)
    const handlePreviousImage = () => {
        const images = selectedVariationDetails?.images?.length > 0 ? selectedVariationDetails.images : product?.images;
        const currentIndex = findCurrentImageIndex();
        const previousIndex = currentIndex - 1 < 0 ? images.length - 1 : currentIndex - 1;
        setSelectedImage(images[previousIndex]);
    };
    const handleNextImage = () => {
        const images = selectedVariationDetails?.images?.length > 0 ? selectedVariationDetails.images : product?.images;
        const currentIndex = findCurrentImageIndex();
        const nextIndex = (currentIndex + 1) % images.length; // Wrap around to the first image if at the end
        setSelectedImage(images[nextIndex]);
    };

    // for showing product image
    const itemToMap = selectedVariationDetails?.images?.length > 0 ? selectedVariationDetails : product;

    const handleBuyNow = async () => {
        setIsLoadingCart(true);

        const productName = selectedVariationDetails?.name ? selectedVariationDetails.name.en : product?.name?.en;
        const productId = product?._id;
        const shopId = product?.shop;
        const price = selectedVariationDetails && selectedVariationDetails.on_sale ? selectedVariationDetails.sales_price : product?.price;
        const total_price = price * quantity;
        const product_varient = selectedVariationDetails._id;
        const userId = JSON.parse(localStorage.getItem('user'))?._id;
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_PATH}/carts/add-product/${userId}`, {
                product_item: {
                    name: productName,
                    product_id: productId,
                    quantity: quantity,
                    price: price,
                    total_price: total_price,
                    shop_id: shopId,
                    product_varient: product_varient,
                    image: product?.images[0]
                },
                "comment": ""
            });
            console.log("Response Data:", response.data.cart);
            // return
            if (response.status === 200) {
                const newItem = {
                    name: {
                        en: productName
                    },
                    _id: response.data?.cart?.items[0]?._id,
                    price: price,
                    quantity: 1, // or any selected quantity
                    total_price: total_price, // Adjust based on quantity if needed
                    image: selectedVariationDetails ? selectedVariationDetails?.images[0] : product?.images[0], // Assuming there's at least one image
                    product_id: {
                        _id: product?._id,
                    },
                    shop_id: {
                        _id: shopId, // Assuming you have shop_id in your product details
                    },
                    product_varient: product_varient, // Adjust according to your data structure
                    ordered: true,
                    order_date: new Date(),
                    paid_amount: price // Adjust based on quantity if needed
                };

                // Now, update the cartItemsAtom or localStorage directly
                const cartItems = {
                    user_id: userId,
                    items: [newItem],
                    sub_total: price, // Adjust if you're considering quantity
                    tax: price * 0.01,
                    total_price: Number(price) + Number(price * 0.01),
                    comment: "",
                    shipping: 0,
                    discount: 0,
                    // estimation = current date + 3 days
                    estimation_date: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000),
                    creation_date: new Date()
                }

                const response2 = await axios.put(`${import.meta.env.VITE_API_PATH}/carts/delete-product/${userId}`, {
                    item_id: response.data?.cart?.items[0]?._id,
                    permanent: false
                })
                // console.log(response)
                if (response2.status === 200) {
                    setCartItemAtom(cartItems)
                    navigate('/delivery');
                } else {
                    showToast('Something went wrong', 'info')
                }

            } else {
                showToast('Something went wrong', 'error');
            }

        } catch (error) {
            console.error("Error adding product to cart:", error);
            showToast('Error adding product to cart', 'error');
        } finally {
            setIsLoadingCart(false);
        }
    };

    const { isError: shopError, isPending: shopPending, data: shop } = useQuery({
        queryKey: ['shop', product?.shop],
        queryFn: async () => {
            const response = await axios.get(`${import.meta.env.VITE_API_PATH}/shops/shop/${product?.shop}`)
            return response?.data?.shop;
        }
    })
    // console.log(shop)


    const RenderVendorInfo = () => {
        // Store name, description, logo, selling category
        return (
            <div className='md:flex gap-2 items-center'>
                <img
                    alt="Banner"
                    className="aspect-[2/1] overflow-hidden rounded-lg object-cover object-center w-full h-[300px] "
                    // height="200"
                    src={shop?.banner}
                    width="400"
                />
                <div className='w-full flex justify-between items-baseline flex-col h-[300px] '>
                    <div className="my-4">
                        <p className='font-bold'>{shop?.name?.en}</p>
                        <p>{shop?.description?.en}</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        <p>
                            {shop?.categories.length > 0 && (
                                <>
                                    {shop?.categories.map((cat, index) => (
                                        <button className="rounded-full" variant="outline" key={index}>
                                            {cat.name}
                                        </button>
                                    ))}
                                </>
                            )}
                        </p>
                    </div>
                    <button size="lg" className='bg-black text-white px-4 py-2 mt-10 md:mt-0 w-full rounded-md content-center'>Contact Shop</button>

                </div>
            </div>
        )
    }

    // const parent = useRef();

    // useEffect(() => {
    //     // Scroll to the parent element when the page loads
    //     if (parent.current) {
    //         parent.current.scrollIntoView({ top: 0, behavior: 'smooth' });
    //     }
    // }, []);

    // ref={parent}

    return (

        <div className='max-w-7xl mx-auto h-full p-3 font-main md:mt-[60px] mt-[30px]' >
            {
                isPending ? <p>Loading...</p> :
                    <>
                        <Sideover open={open} setOpen={setOpen} />
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
                        <div className='grid grid-cols-1 lg:grid-cols-2 gap-7'>
                            <div className='grid md:grid-cols-6 grid-cols-1'>
                                {/* All image preview part*/}
                                <div className='col-span-2 flex md:flex-col items-center gap-5 order-1 md:order-0'>
                                    {/* Map over product images */}
                                    {
                                        itemToMap?.images?.map((image, index) => (
                                            <div key={index}
                                                onClick={() => setSelectedImage(image)}
                                                className='w-[126px] h-[126px] p-1 focus:ring-1 border-[1px] border-gray-200 flex justify-center items-center rounded-md cursor-pointer hover:bg-gray-100 transition'
                                            >
                                                <img src={image} alt={`Image ${index + 1}`} className='w-full h-full rounded-md object-cover p-[1px]' />
                                            </div>
                                        ))}
                                </div>
                                {/*selected image list part */}
                                <div className='col-span-4 flex justify-center items-center border-[1px] relative max-h-[600px] rounded-md md:order-1'>
                                    {/* arrow button for sliding */}
                                    <div className='absolute top-1/2 -left-4 transform -translate-y-1/2'>
                                        <button
                                            className='bg-gray-100 p-2 rounded-full hover:bg-gray-200 transition'
                                            onClick={handlePreviousImage}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                    </div>

                                    <p className='absolute top-3 left-3 bg-[#1A985B] px-3 py-1 text-primary-text-color rounded-md'>
                                        20% off
                                    </p>
                                    <img src={selectedImage} alt="image" className='md:w-full md:h-full object-cover rounded-md' />
                                    {/* arrow button for sliding */}
                                    <div
                                        className='absolute top-1/2 -right-4 transform -translate-y-1/2'
                                        onClick={handleNextImage}
                                    >
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
                                <p className='font-[700] md:text-[26px] text-md text-secondary-text-color'>
                                    {
                                        product?.name?.en +
                                        (selectedVariationDetails.price !== null
                                            ? ' (' + selectedVariationDetails.name.en + ')'
                                            : '')
                                    }
                                </p>
                                {/* Brand | Rating | Code */}
                                <div className='mt-[16px] gap-3 flex justify-start items-center flex-wrap'>
                                    <p className='text-[16px]'><span className='font-[600] text-gray-500 '>Brand</span> : <span className=' mx-1 text-secondary-text-color'>{product?.brand && product?.brand}</span></p>
                                    <div className='border-x-2 px-3 border-gray-400 h-[20px] flex items-center'>
                                        <p className='text-[16px] flex items-center '>
                                            <ReactStars
                                                count={5}
                                                half={true}
                                                value={reviewData?.avg_rating}
                                                edit={false}
                                                size={24}
                                                color2={'#ffd700'}
                                            />
                                            <span className='gray-800 ms-3 mt-1'>(50)</span>
                                        </p>
                                    </div>
                                    <div>
                                        <p className='text-[16px]'><span className='font-[600] text-gray-500'>Code </span> : <span className='mx-1 text-secondary-text-color'>{product?.sku && product?.sku}</span></p>
                                    </div>
                                </div>
                                {/* Amount and discount */}
                                {
                                    selectedVariationDetails.price !== null ? (
                                        <div className='flex items-center gap-3 mt-[24px]'>
                                            <p className='text-[32px] font-[700] text-[#1A985B]'>
                                                {selectedVariationDetails.sales_price} USD
                                            </p>
                                            {selectedVariationDetails.sales_price && (
                                                <p className='text-[20px] font-[700] line-through text-gray-400 mt-1'>
                                                    {selectedVariationDetails.price} USD
                                                </p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className='flex items-center gap-3 mt-[24px]'>

                                            {product?.sales_price ?
                                                <>
                                                    <p className='text-[32px] font-[700] text-[#1A985B]'>{product?.sales_price} USD</p>
                                                    <p className='text-[20px] font-[700] line-through text-gray-400 mt-1'>
                                                        {product?.price} USD
                                                    </p>
                                                </> :
                                                <>
                                                    <p className='text-[20px] font-[700] text-gray-400 mt-1'>
                                                        {product?.price} USD
                                                    </p>
                                                </>
                                            }
                                        </div>
                                    )
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
                                    product?.allow_bulk === true && product?.bulk_prices?.length > 0 && (
                                        <div className='overflow-scroll my-[27px] flex justify-start ' style={{ scrollbarWidth: 'none' }}>
                                            {
                                                product?.bulk_prices
                                                    .filter(item => item.low_range !== undefined)
                                                    .map((item, index) => {
                                                        return (
                                                            <div key={index} className='flex items-start gap-2 flex-col justify-start min-w-[150px] '>
                                                                <p className='text-[14px] font-[600] text-secondary-text-color ms-2'> {item?.low_range} - {item.high_range} Items </p>
                                                                <p className='text-[30px] font-[700] text-secondary-text-color ms-2'> {item?.price} USD</p>
                                                            </div>
                                                        )
                                                    })
                                            }
                                        </div>
                                    )
                                }
                                {/* description */}
                                <p className='text-[14px] text-secondary-text-color font-[600] mt-6'>
                                    {selectedVariationDetails.description?.en || product?.description?.en}
                                </p>

                                {/* make variation dynamic  */}
                                <div>
                                    {renderVariationOptions()}
                                </div>
                                {/* count */}
                                <div className='flex items-center gap-3 mt-6'>
                                    <div
                                        onClick={handleMinusProductCount}
                                        className='border border-gray-100 w-[45px] h-[40px] flex justify-center items-center rounded-md cursor-pointer bg-gray-100'>
                                        <p className='text-[22px] font-[600]'>-</p>
                                    </div>
                                    <div className='w-[40px] h-[40px] flex justify-center items-center rounded-md cursor-pointer text-secondary-text-color'>
                                        {/* quantity of products */}
                                        <p className='text-[16px] font-[600]'>{quantity < 10 ? '0' + quantity : quantity}</p>
                                    </div>
                                    <div
                                        onClick={handleAddProductCount}
                                        className='border border-gray-100 w-[45px] h-[40px] flex justify-center items-center rounded-md cursor-pointer bg-gray-100'>
                                        <p className='text-[22px] font-[600]'>+</p>
                                    </div>

                                    {/* add to cart */}
                                    <div className='w-full lg:ms-5' >
                                        <div
                                            // call add to cart function onclick
                                            onClick={() => {
                                                if (user) {
                                                    handleAddToCart()
                                                } else {
                                                    showToast('Sign in to add to cart', 'info')
                                                }
                                            }}
                                            className='border border-gray-100 py-2 flex justify-center gap-2 items-center rounded-md cursor-pointer bg-gray-100 transition-all'>
                                            {
                                                isLoadingCart ?
                                                    // loading spinnner
                                                    <>
                                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-600"></div>
                                                        <p className='text-[16px] font-[600]'>Adding to Cart..</p>
                                                    </>
                                                    : <>
                                                        <IoBagHandleOutline />
                                                        <p className='text-[16px] font-[600] '>Add to Cart</p>
                                                    </>
                                            }
                                        </div>
                                    </div>
                                </div>
                                {/* buy now green color*/}
                                <div className='w-full mt-6' >
                                    <div onClick={handleBuyNow} className='border border-gray-100 py-2 flex justify-center gap-2 items-center rounded-md cursor-pointer hover:bg-[#1A985B] bg-secondary-color hover:text-primary-text-color transition'>
                                        <p className='text-[16px] font-[600] text-primary-text-color'>Buy Now</p>
                                    </div>
                                </div>
                                {/* wishlish, compare and share buttons */}
                                <div className='flex items-center gap-3 mt-6'>
                                    <div
                                        onClick={() => {
                                            if (user) {
                                                handleAddtoWishlist(id)
                                            } else {
                                                showToast('Sign in to add to cart', 'info')
                                            }
                                        }}

                                        className='border border-gray-100 py-2 flex justify-center gap-2 items-center rounded-md cursor-pointer bg-gray-100 w-40 text-gray-900'>
                                        <CiHeart />
                                        <p className='text-[16px]'>Add Wishlist</p>
                                    </div>
                                    {/* compare */}
                                    <div className='border border-gray-100 flex justify-center gap-2 items-center rounded-md cursor-pointer bg-gray-100 text-gray-900 px-3 py-3'>
                                        <FaCodeCompare className='text-[13px]' />
                                    </div>
                                    {/* share */}
                                    <div className='border border-gray-100 flex justify-center gap-2 items-center rounded-md cursor-pointer bg-gray-100 text-gray-900 px-3 py-3'>
                                        <IoShareSocial className='text-[14px]' />
                                    </div>
                                </div>
                                {/* hr line */}
                                <div className='border-b border-gray-200 my-8'></div>
                                {/* estimated delivery and returns */}
                                <div className='flex items-center gap-3'>
                                    <p className='text-[16px] font-[600] text-gray-900 flex items-center gap-3'><LiaTruckMovingSolid className='text-gray-700' /> Estimated Delivery : </p>
                                    <p className='text-[16px] font-[600] text-gray-500'>{new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000).toDateString()}</p>
                                </div>
                                {/* returns */}
                                <div className='flex items-center gap-3 my-3'>
                                    <p className='text-[16px] font-[600] text-gray-900 flex items-center gap-3'><GoGift className='text-gray-700' /> Free Shipping & Returns : </p>
                                    <p className='text-[16px] font-[600] text-gray-500'>Orders over 300.00 USD</p>
                                </div>
                                {/* we accept payments */}
                                <div className='flex items-center gap-3 mt-6 bg-gray-100 justify-center py-2 rounded-sm'>
                                    <p className='text-[16px] font-[600] text-gray-900 flex items-center gap-3'>We Accept Visa </p>
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
                                        {selectedVariationDetails.description?.en || product?.description?.en}
                                    </p>
                                    {/* qualities */}
                                    {/* <div className='flex mt-6 md:gap-10'>
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

                                    </div> */}
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
                                <RenderVendorInfo />
                            ) : (
                                // reviews tab
                                <>
                                    {
                                        reviewData?.reviews?.length == 0 && <p>No reviews yet </p>
                                    }
                                    {/* review list */}
                                    {
                                        reviewData?.reviews?.map((item, index) => {
                                            return (
                                                <div className='flex justify-start items-start gap-3 flex-col shadow-md p-3'>
                                                    <div className='flex justify-between w-full'>
                                                        <p className='flex gap-2 text-gray-400'>
                                                            <RxAvatar className='w-6 h-6' />
                                                            <span className='text-gray-500'>{item.customer.firstname} {item.customer?.lastname}</span>
                                                        </p>
                                                        <p className='flex gap-2'>
                                                            <CiCalendarDate className='w-6 h-6' />
                                                            {new Date(item?.updatedAt).toDateString()}
                                                        </p>
                                                    </div>
                                                    <div className='border-t-2 w-full py-2'>
                                                        <div className='flex justify-between py-2 flex-wrap'>
                                                            <p>
                                                                {item.feedback ? item.feedback : 'No feedback'}
                                                            </p>
                                                            <ReactStars
                                                                count={5}
                                                                half={true}
                                                                value={item.rating}
                                                                edit={false}
                                                                size={24}
                                                                color2={'#ffd700'}
                                                            />
                                                        </div>
                                                        {
                                                            item.images && item.images.length > 0 &&
                                                            <div className='flex gap-2 '>
                                                                {item.images.map((image, index) => (
                                                                    <img key={index} src={image} alt='img' className='w-24 h-24 rounded-md' />
                                                                ))}
                                                            </div>
                                                        }
                                                    </div>
                                                </div>
                                            )
                                        })
                                    }
                                </>
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

export default Products