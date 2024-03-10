import React, { useState } from 'react'
import TextField from '../../../components/Signup/TextField'
import Button from '../../../components/Signup/Button'
import { vendorAtom } from '../../../lib/jotai'
import { useSetAtom } from 'jotai'
import { useNavigate } from 'react-router-dom'
import background from 'assets/constant/background/bg-image.png'
import { showToast } from '../../../components/Common/Toastify/Toastify'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'


const VendorStepOne = () => {
  const setVendorAtom = useSetAtom(vendorAtom)

  const [email, setEmail] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('')
  const [terms, setTerms] = useState(false)
  const navigate = useNavigate()

  const countries = [
    'Saudi Arabia',
    'UAE',
    'China'
  ];

  const phoneInputStyles = {
    // Add custom styles here
    input: {
      width: '100%',
      padding: '20px 45px',
    }
    // Add more styles if necessary
  };

  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };


  const categories = [
    'Food',
    'Clothing',
    'Electronics',
    'Coffee'
  ];
  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  const handleContinueButton = () => {
    if (terms === false) {
      showToast('Please agree to the terms and conditions', 'error')
      return
    }

    if (email && companyName && selectedCountry && selectedCategory && phoneNumber) {
      setVendorAtom({
        business_email: email,
        business_name: companyName,
        region: selectedCountry,
        main_category: selectedCategory,
        business_phone_no: phoneNumber
      })

      navigate('/vendor-step-two')
    } else {
      showToast('Please fill all the fields', 'error')
    }
  }


  // main return
  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'bottom',
      }}
    >
      <div className='max-w-7xl mx-auto mt-[87px] font-main pb-10 lg:pb-20 px-4'>

        <p className='font-teko text-[60px] text-center px-2'>
          Start Selling on Sonbola!
        </p>
        <p className='font-teko text-[18px] text-center'>
          Tell us a little about you and your organizaiton.
        </p>

        <div
          style={{ boxShadow: '0px 7.204px 36.022px 0px rgba(0, 0, 0, 0.12)' }}
          className='bg-white w-full h-[100%] max-w-[786px] mx-auto pb-6 flex justify-center flex-col items-center mt-[20px] font-main'>
          <h2 className='text-center text-[#77878F] font-[600] text-[18px] mt-[14px] pb-[12px] border-b-2 w-full border-b-gray-100'>
            Step 1 of 2
          </h2>
          <div className='w-[100%] grid grid-cols-1 md:grid-cols-2 gap-4 px-6 py-4'>
            <TextField label='Comany Email' type='email' placeholder='' value={email} onChange={setEmail} />
            <TextField label='Company Name' type='text' placeholder='' value={companyName} onChange={setCompanyName} />
            <TextField label='Company Address' type='text' placeholder='' value={selectedCountry} onChange={setSelectedCountry} />

            {/* <div>
              <label className='text-sm text-gray-700 text-[12px] font-[500]'>
                Region where company is located
              </label>
              <select
                className='w-[100%] px-2 py-2.5 border outline-none'
                value={selectedCountry}
                onChange={handleCountryChange}
              >
                <option value=''>Select a country</option>
                {countries.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div> */}
            <div className='flex justify-center items-center mt-2'>
              <PhoneInput
                country={'sa'}
                onlyCountries={['sa']}
                value={phoneNumber}
                onChange={phone => setPhoneNumber(phone)}
                disableDropdown={true}
                inputStyle={phoneInputStyles.input}
              />
            </div>
            {/* <TextField label='Phone Number' type='text' placeholder='' value={phoneNumber} onChange={setPhoneNumber} /> */}
          </div>
          <div className='w-full px-6'>
            <select
              className='w-[100%] px-2 py-2.5 border outline-none'
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              <option value=''>Select a category</option>
              {
                categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))
              }
            </select>
          </div>

          <div className='w-full px-6 mt-6' onClick={handleContinueButton}>
            <Button text='CONTINUE' />
          </div>
          <div className='flex items-center mb-4 w-full px-6'>
            <input type='checkbox' className='mr-2 mb-4 w-4 h-4 text-lime-500 mt-4' onChange={() => {
              setTerms(!terms)
            }} />
            <p className='text-sm text-gray-400'>I agree to <span className='text-[#2DA5F3] cursor-pointer'>Terms and Conditions</span> and <span className='text-[#2DA5F3] cursor-pointer'> Privacy Policy.</span></p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default VendorStepOne