import React, { useEffect, useState } from 'react'
import VendorHeader from 'src/components/Vendor/VendorHeader/VendorHeader'
import { CiTrash } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import { GrSend } from "react-icons/gr";
import { showToast } from 'src/components/Common/Toastify/Toastify';
import axios from 'axios';

const VendorCustomOrder = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));
    const [searchValue, setSearchValue] = useState("");
    const [customerSearchValue, setCustomerSearchValue] = useState("");

    const [originalProducts, setOriginalProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [customers, setCustomers] = useState([]);
    const [filteredCustomers, setFilteredCustomers] = useState([]);
    const [defaultQuantity, setDefaultQuantity] = useState(1);


    // console.log(user.vendor_info?.shop?._id)
    const fetchProducts = () => {
        if (!user.vendor_info?.shop?._id) return;
        fetch(`${import.meta.env.VITE_API_PATH}/products/get-all?shop=${user.vendor_info?.shop?._id}`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                const productNames = data?.product_info?.map(product => product); // Assuming 'en' is the English language code
                setOriginalProducts(productNames);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
            });
    };

    const fetchUsers = () => {
        fetch(`${import.meta.env.VITE_API_PATH}/users/get-all?type=customer`, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
            }
        })
            .then((response) => response.json())
            .then((data) => {
                setCustomers(data?.users);
            })
            .catch((error) => {
                console.error('Error fetching products:', error);
            });
    };

    useEffect(() => {
        fetchProducts();
        fetchUsers();
    }, []);

    const handleProductChange = (product) => {
        // Update selected product IDs
        setSelectedProducts((prevSelectedProducts) => [
            ...prevSelectedProducts,
            product,
        ]);

        // Clear the search input but keep the filtered products
        setSearchValue('');
    };

    const handleSearchChange = (value) => {
        console.log("Search Value:", value);
        setSearchValue(value);

        const filtered = originalProducts.filter((product) =>
            product?.name?.en.toLowerCase().includes(value.toLowerCase())
        );
        // console.log("Filtered Products:", filtered);
        setFilteredProducts(filtered);
    };

    const handleCustomerChange = (value) => {
        setCustomerSearchValue(value);
        const filtered = customers.filter((customer) =>
            customer?.email.toLowerCase().includes(value.toLowerCase())
        );
        // console.log("Filtered Customers:", filtered);
        setFilteredCustomers(filtered);
        // setSelectedCustomer(filtered);
    }
    const handleSelectCustomer = (customer) => {
        setSelectedCustomer(customer);
        setCustomerSearchValue(customer.email);
    }

    const handleProductPriceChange = (index, newPrice) => {
        setSelectedProducts((prevSelectedProducts) => {
            const updatedProducts = [...prevSelectedProducts];
            updatedProducts[index].price = newPrice;
            return updatedProducts;
        });
    };

    const handleProductQuantityChange = (index, newQuantity) => {
        setSelectedProducts((prevSelectedProducts) => {
            const updatedProducts = [...prevSelectedProducts];
            updatedProducts[index].quantity = newQuantity;
            return updatedProducts;
        });
    };

    const handleCustomOrder = async () => {
        if (selectedCustomer === null) {
            showToast('Select your customer', 'info');
            return;
        }
        if (selectedProducts.length === 0) {
            showToast('Please select a product', 'info');
            return;
        }

        const orderItems = selectedProducts.map((product) => ({
            name: {
                en: product.name.en,
            },
            product_id: product._id, // Assuming your product object has an _id field
            quantity: product.quantity || 1, // Using a default quantity of 1 if not provided
            price: product.price,
            total_price: product.quantity ? product.price * product.quantity : product.price,
            shop_id: user.vendor_info.shop._id,
        }));

        const data = {
            customer_id: selectedCustomer._id,
            vendor_id: user?._id,
            shop: user?.vendor_info.shop._id,
            order: {
                items: orderItems,
            }
        }
        console.log(data)

        const res = await axios.post(`${import.meta.env.VITE_API_PATH}/custom-orders/create`, data, {
            headers: {
                Authorization: `Bearer ${JSON.parse(localStorage.getItem('token')).accessToken}`
            }
        });
        console.log(res.data);

        if (res.status === 200) {
            showToast('Custom order created', 'success');
            navigate('/vendor-orders');
        }


    }

    return (
        <div className='h-full p-3 font-main lg:-ms-10'>
            <VendorHeader />
            <p className='font-[500] text-md'>Custom order</p>
            <div className='relative my-6'>
                <label
                    htmlFor="name"
                    className="absolute left-2 -top-2 rtl:right-3 rtl:left-full bg-white px-2 text-xs font-medium text-gray-900 whitespace-nowrap"
                >
                    Add Customer
                </label>
                <input
                    type="text"
                    name="relatedProduct"
                    value={customerSearchValue}
                    onChange={(e) => {
                        handleCustomerChange(e.target.value);
                        // if the input is empty
                        if (e.target.value === '') {
                            setSelectedCustomer(null);
                        }
                    }}
                    // if endter and backspace is pressed
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSelectCustomer(filteredCustomers[0]);
                        }
                        if (e.key === 'Backspace') {
                            setSelectedCustomer(null);
                        }
                    }}
                    className="block w-full rounded-md border-0 p-3 text-gray-900 shadow-sm ring-1 ring-inset outline-none ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    placeholder="Search by email"
                />
                {
                    customerSearchValue !== '' && selectedCustomer == null && (
                        <div className="border px-3 rounded-b-md">
                            <ul className="cursor-pointer py-2">
                                {filteredCustomers?.map((customer, index) => (
                                    <li key={index} className='py-2' onClick={() => handleSelectCustomer(customer)}>
                                        <div className="flex justify-between">
                                            <span>{customer?.email}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )
                }
            </div >

            {/* select products and edit quantity and price */}
            <p className='font-[500] text-sm mt-4'>Select Order</p>
            <div className='relative my-6'>
                <label
                    htmlFor="name"
                    className="absolute left-2 -top-2 rtl:right-3 rtl:left-full bg-white px-2 text-xs font-medium text-gray-900 whitespace-nowrap"
                >
                    Add Order
                </label>
                <input
                    type="text"
                    name="relatedProduct"
                    value={searchValue}
                    onChange={(e) => {
                        handleSearchChange(e.target.value);
                    }}
                    className="block w-full rounded-md border-0 p-3 text-gray-900 shadow-sm ring-1 ring-inset outline-none ring-gray-300 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    placeholder="Search for products..."
                />
                {searchValue !== '' && (
                    <div className="border px-3 rounded-b-md">
                        <ul className="cursor-pointer py-2">
                            {filteredProducts?.map((product, index) => (
                                <li key={index} className='py-2' onClick={() => handleProductChange(product)}>
                                    <div className="flex justify-between">
                                        <span>{product?.name?.en}</span>
                                        <span>{product.price}</span>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
                {/* show selected products */}
                <>
                    {selectedProducts?.map((product, index) => {

                        return (
                            <div key={index} className="flex items-start justify-start mr-1 mb-1 text-primary-text-color rounded-md mt-4 relative shadow-md pe-4 py-2 overflow-hidden">
                                {
                                    product?.images?.[0] ?
                                        <img src={product?.images?.[0]} alt={product?.name?.en} className="w-[120px] h-[120px] object-cover rounded-lg" /> :
                                        <div className="w-[120px] h-[120px] object-cover rounded-t-md bg-gray-300">
                                            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-8 text-gray-400 text-2xl">No Image</span>
                                        </div>
                                }
                                <div>
                                    <p className='text-md text-black p-2 w-[600px]'>{product?.name?.en}</p>
                                    <div className='flex mt-3'>
                                        {/* Editable Price */}
                                        <div className='relative'>
                                            <label htmlFor="price" className='text-gray-800 text-[10px] absolute -top-[6px] left-4 bg-white px-1'>Price</label>
                                            <input
                                                type="number"
                                                value={product.price}
                                                min={1}
                                                onChange={(e) => handleProductPriceChange(index, parseFloat(e.target.value))}
                                                className="text-md text-black p-2 border rounded-md ms-2 outline-none"
                                            />
                                        </div>
                                        {/* Editable Quantity */}
                                        <p className='text-md text-black p-2 mx-2'>x</p>
                                        <div className='relative'>
                                            <label htmlFor="quantity" className='text-gray-800 text-[10px] absolute -top-[6px] left-2 bg-white px-1'>Quantity</label>
                                            <input
                                                type="number"
                                                value={defaultQuantity}
                                                min={1}
                                                onChange={(e) => {
                                                    setDefaultQuantity(parseInt(e.target.value));
                                                    handleProductQuantityChange(index, parseInt(e.target.value))
                                                }}
                                                className="text-md text-black p-2 border rounded-md outline-none me-2"
                                            />
                                        </div>

                                        {/* Display Total Price */}
                                        <p className='text-md text-black p-2'>{isNaN(product.price * defaultQuantity) ? <p className='text-red-600'> Invalid amount</p> : `$ ${product.price * defaultQuantity}`}</p>
                                    </div>
                                </div>

                                <CiTrash
                                    className="text-gray-700 w-5 h-5 cursor-pointer ms-auto mt-12 hover:text-red-700 transition duration-300 ease-in-out animate-pulse"
                                    onClick={() => {
                                        setSelectedProducts((prevSelectedProducts) =>
                                            prevSelectedProducts.filter(
                                                (prevProduct) => prevProduct !== product
                                            ));
                                    }} />


                            </div>
                        )
                    }
                    )}

                </>
            </div>



            <button
                onClick={handleCustomOrder}
                className='hover:bg-green-600 cursor-pointer transition text-[12px] border-2 border-[#E5E5E5] bg-[#1A985B] text-primary-text-color rounded-md py-2 px-4 flex justify-center items-center gap-1 mb-4 lg:mt-0'>
                Send Custom Order request
                <GrSend className='w-4 h-4' />
            </button>
        </div >
    )
}

export default VendorCustomOrder