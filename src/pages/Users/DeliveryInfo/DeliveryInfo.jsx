import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Stepper from 'src/components/User/Cart/Stepper/Stepper'
import Select from 'react-select'
import countryList from 'react-select-country-list'
import { atom, useAtomValue, useSetAtom } from 'jotai'
import DeliveryInput from 'src/components/User/DeliveryInfo/DeliveryInput'
import { showToast } from 'src/components/Common/Toastify/Toastify'
import { cartItemsAtom } from 'src/lib/jotai'
import axios from 'axios'


const DeliveryInfo = () => {
    const navigate = useNavigate()
    const setCartItems = useSetAtom(cartItemsAtom);
    const [voucher, setVoucher] = useState('')
    const [cartItems, setNewCartItems] = useState(JSON.parse(localStorage.getItem('cartItems')) || { items: [], sub_total: 0, tax: 0, total_price: 0 })
    
    // shipping address state
    const [shippingName, setShippingName] = useState(cartItems.shipping_address?.name || '')
    const [shippingEmail, setShippingEmail] = useState(cartItems.shipping_address?.email || '')
    const [shippingPhone, setShippingPhone] = useState(cartItems.shipping_address?.phone_no || '')
    const [shippingCompany, setShippingCompany] = useState(cartItems.shipping_address?.company || '')
    const [shippingZipCode, setShippingZipCode] = useState(cartItems.shipping_address?.zip || '')
    const [shippingCountry, setShippingCountry] = useState(cartItems.shipping_address?.country || 'Saudi Arabia')
    const [shippingAddress1, setShippingAddress1] = useState(cartItems.shipping_address?.address1 || '')
    const [shippingAddress2, setShippingAddress2] = useState(cartItems.shipping_address?.address2 || '')
    // billing address state
    const [billingName, setBillingName] = useState(cartItems.billing_address?.name || '')
    const [billingEmail, setBillingEmail] = useState(cartItems.billing_address?.email || '')
    const [billingPhone, setBillingPhone] = useState(cartItems.billing_address?.phone_no || '')
    const [billingCompany, setBillingCompany] = useState(cartItems.billing_address?.company || '')
    const [billingZipCode, setBillingZipCode] = useState(cartItems.billing_address?.zip || '')
    const [billingCountry, setBillingCountry] = useState(cartItems.billing_address?.country || 'Saudi Arabia')
    const [billingAddress1, setBillingAddress1] = useState(cartItems.billing_address?.address1 || '')
    const [billingAddress2, setBillingAddress2] = useState(cartItems.billing_address?.address2 || '')

    // console.log(shippingName, shippingEmail, shippingPhone, shippingCompany, shippingZipCode, shippingCountry, shippingAddress1, shippingAddress2)
    // console.log(billingName, billingEmail, billingPhone, billingCompany, billingZipCode, billingCountry, billingAddress1, billingAddress2)
    // Checkbox state
    const [sameAsShipping, setSameAsShipping] = useState(false);
    // Function to handle checkbox change
    const handleCheckboxChange = () => {
        setSameAsShipping(!sameAsShipping);

        // If checked, copy shipping address to billing address
        if (!sameAsShipping) {
            setBillingName(shippingName);
            setBillingEmail(shippingEmail);
            setBillingPhone(shippingPhone);
            setBillingCompany(shippingCompany);
            setBillingZipCode(shippingZipCode);
            setBillingCountry(shippingCountry);
            setBillingAddress1(shippingAddress1);
            setBillingAddress2(shippingAddress2);
        } else {
            // Clear billing address fields if unchecked
            setBillingName('');
            setBillingEmail('');
            setBillingPhone('');
            setBillingCompany('');
            setBillingZipCode('');
            setBillingCountry('');
            setBillingAddress1('');
            setBillingAddress2('');
        }
    };

    const validateAllFields = () => {
        return (
            !!shippingName &&
            !!shippingEmail &&
            !!shippingPhone &&
            !!shippingZipCode &&
            !!shippingCountry &&
            !!shippingAddress1 &&
            !!billingName &&
            !!billingEmail &&
            !!billingPhone &&
            !!billingZipCode &&
            !!billingCountry &&
            !!billingAddress1
        );
    };

    const handleNextButton = () => {
        // Validate all fields before navigating
        if (validateAllFields()) {
            setCartItems({
                ...cartItems,
                shipping_address: {
                    address1: shippingAddress1,
                    address2: shippingAddress2,
                    zip: shippingZipCode,
                    country: shippingCountry,
                    phone_no: shippingPhone,
                    company: shippingCompany,
                    name: shippingName,
                    email: shippingEmail,
                },
                billing_address: {
                    address1: billingAddress1,
                    address2: billingAddress2,
                    zip: billingZipCode,
                    country: billingCountry,
                    phone_no: billingPhone,
                    company: billingCompany,
                    name: billingName,
                    email: billingEmail,
                }
            });

            navigate('/payment');
        } else {
            showToast('Please fill in all required fields.', 'error');
        }
    }
    useEffect(() => {
        setNewCartItems(JSON.parse(localStorage.getItem('cartItems')))
    }, [voucher])

    const handleApplyVoucher = async () => {
        // Check if voucher is valid
        console.log(voucher)
        if (voucher) {
            // If invalid, show error message
            try {
                const res = await axios.post(`${import.meta.env.VITE_API_PATH}/promos/apply`, {
                    code: voucher
                })

                console.log(res)
                if (res.status == 200) {
                    console.log(res.data.voucher)
                    if( res.data.voucher.is_percent == true){
                        // set discount
                        const discount =  Number(cartItems.sub_total ) * Number( res.data.voucher.percent ) / 100;
                        const total_price = Number(cartItems.sub_total) + Number(cartItems.tax) -  Number( discount )  ;
                        setCartItems({
                            ...cartItems,
                            total_price: total_price,
                            discount: discount
                        });
                        setNewCartItems(JSON.parse(localStorage.getItem('cartItems')))
                    }
                    showToast('Voucher applied successfully.', 'success');
                } else {
                    showToast('Invalid voucher code.', 'error');
                }
            }catch(err) {
                showToast('Invalid voucher code.', 'error');
            }


        } else {
            showToast('Please enter a valid voucher code.', 'error');
        }
    }
    
    return (
        <div className='h-full p-3 font-main max-w-7xl mx-auto'>
            <Stepper activeStep={1} />

            <div className='grid grid-cols-1 md:grid-cols-6 gap-4'>
                {/* Shipping and billing address */}
                <div className='col-span-1 md:col-span-4 space-y-8'>
                    {/* shipping address */}
                    <div className='md:px-8 md:py-4' style={{
                        boxShadow: '0px 1px 3px 0px #03004717'
                    }}>
                        <p className='font-[600] text-secondary-text-color'>Shipping Address</p>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-10'>
                            <DeliveryInput type={'text'} label={'Full name'} value={shippingName} onChange={setShippingName} required={true} />
                            <DeliveryInput type={'email'} label={'Email Address'} value={shippingEmail} onChange={setShippingEmail} required={true} />
                            <DeliveryInput type={'number'} label={'Phone Number'} value={shippingPhone} onChange={setShippingPhone} required={true} />
                            <DeliveryInput type={'text'} label={'Company'} value={shippingCompany} onChange={setShippingCompany} required={false} />
                            <DeliveryInput type={'text'} label={'Zip Code'} value={shippingZipCode} onChange={setShippingZipCode} required={true} />
                            <DeliveryInput type={'text'} label={'Country'} value={shippingCountry} onChange={setShippingCountry} required={true} />
                            <DeliveryInput type={'text'} label={'Address 1'} value={shippingAddress1} onChange={setShippingAddress1} required={true} />
                            <DeliveryInput type={'text'} label={'Address 2'} value={shippingAddress2} onChange={setShippingAddress2} required={false} />
                        </div>
                    </div>
                    {/* billing address */}
                    <div className='md:px-8 md:py-4' style={{
                        boxShadow: '0px 1px 3px 0px #03004717'
                    }}>
                        <p className='font-[600] text-secondary-text-color'>Billing Address</p>
                        {/* checkbox for same as shipping address */}
                        <div className='flex gap-2 my-3 items-center' >
                            <input
                                type="checkbox"
                                className='w-4 h-4'
                                checked={sameAsShipping}
                                onChange={handleCheckboxChange}
                            />
                            <p className='text-secondary-text-color'>Same as shipping address</p>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-10'>
                            <DeliveryInput type={'text'} label={'Full name'} value={billingName} onChange={setBillingName} required={true} />
                            <DeliveryInput type={'email'} label={'Email Address'} value={billingEmail} onChange={setBillingEmail} required={true} />
                            <DeliveryInput type={'number'} label={'Phone Number'} value={billingPhone} onChange={setBillingPhone} required={true} />
                            <DeliveryInput type={'text'} label={'Company'} value={billingCompany} onChange={setBillingCompany} required={false} />
                            <DeliveryInput type={'text'} label={'Zip Code'} value={billingZipCode} onChange={setBillingZipCode} required={true} />
                            <DeliveryInput type={'text'} label={'Country'} value={billingCountry} onChange={setBillingCountry} required={true} />
                            <DeliveryInput type={'text'} label={'Address 1'} value={billingAddress1} onChange={setBillingAddress1} required={true} />
                            <DeliveryInput type={'text'} label={'Address 2'} value={billingAddress2} onChange={setBillingAddress2} required={false} />
                        </div>

                    </div>
                    {/* buttons */}
                    <div className='flex justify-between items-center gap-3'>
                        <button
                            className='ms-auto border-[1px] border-green-400 px-3 py-2 rounded-md text-green-500 transition'
                            onClick={() => {
                                navigate('/cart')
                            }}
                        >
                            Back to Cart
                        </button>
                        <button
                            className='bg-green-700 text-primary-text-color px-3 py-2 rounded-md hover:bg-green-600 transition'
                            onClick={handleNextButton}
                        >
                            Next - Payment
                        </button>
                    </div>

                </div>


                {/* cart info of right side*/}
                <div className="col-span-1 md:col-span-2 align-top">
                    <div className='flex flex-col gap-3 p-7'>
                        <p className='text-secondary-text-color font-[600] mb-4'>Your Order</p>
                        {
                            cartItems?.items?.length === 0 && (
                                <div className='flex justify-center items-center h-[200px]'>
                                    <p className='text-gray-500'>No items in the cart</p>
                                </div>
                            )
                        }
                        {cartItems?.items.map((item) => (
                            <div key={item._id} className='flex justify-between items-center text-[18px]'>
                                <div className='flex gap-2 '>
                                    <p className={`text-gray-500 font-[600] ${item?.name?.en?.length > 40 && 'lg:w-[6.8rem]'}`}>{item.quantity} x </p>
                                    <p className='text-gray-700'>{item?.name?.en}</p>
                                </div>
                                <p className='text-secondary-text-color'>${item?.total_price?.toFixed(2)}</p>
                            </div>
                        ))}

                        <hr className='w-full bg-gray-200 h-[2px] my-2' />

                        <div className='flex justify-between text-[18px]'>
                            <p className='text-gray-500'>Subtotal :</p>
                            <p className='text-secondary-text-color font-[600]'>${cartItems.sub_total.toFixed(2)}</p>
                        </div>

                        <div className='flex justify-between text-[18px]'>
                            <p className='text-gray-500'>Shipping :</p>
                            <p className='text-secondary-text-color font-[600]'>-</p>
                        </div>

                        <div className='flex justify-between text-[18px]'>
                            <p className='text-gray-500'>Tax :</p>
                            <p className='text-secondary-text-color font-[600]'>${Number(cartItems.tax).toFixed(2)}</p>
                        </div>

                        <div className='flex justify-between text-[18px]'>
                            <p className='text-gray-500'>Discount :</p>
                            <p className='text-green-600 font-[600]'>${Number(cartItems.discount).toFixed(2)}</p>
                        </div>

                        <hr className='w-full bg-gray-200 h-[2px] my-2' />

                        <div className='flex justify-between text-[18px]'>
                            <p className='text-secondary-text-color font-[600]'>Total :</p>
                            <p className='text-secondary-text-color font-[600]'>${Number(cartItems.total_price).toFixed(2)}</p>
                        </div>

                        {/* vouchar */}
                        <div className='flex gap-2 items-center mt-4'>
                            <input
                                value={voucher}
                                onChange={(e) => setVoucher(e.target.value)}
                                type="text"
                                placeholder="Voucher Code"
                                className='w-full h-10 px-4 border-[1px] border-gray-300 rounded-md focus:outline-none focus:border-green-600'
                            />

                        </div>
                        <button
                            onClick={handleApplyVoucher}
                            className='bg-green-700 text-primary-text-color px-3 py-2 rounded-md hover:bg-green-600 transition'
                        >
                            Apply
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DeliveryInfo