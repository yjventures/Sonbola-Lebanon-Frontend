import React, { useEffect, useState } from 'react'
import TextField from '../../components/Signup/TextField'
import Button from '../../components/Signup/Button'
import GoogleAndAppleButton from '../../components/Signup/GoogleAndAppleButton'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useSetAtom } from 'jotai'
import { authLoadingAtom, userAtom } from '../../lib/jotai'
import Spinner from '../../components/Signup/Spinner'
import background from 'assets/constant/background/bg-image.png'
import { showToast } from '../../components/Common/Toastify/Toastify'


const Signup = ({ }) => {
  const location = useLocation();
  const path = location.pathname;

  const navigate = useNavigate()
  const setUserAtom = useSetAtom(userAtom)
  const setAuthLoadingAtom = useSetAtom(authLoadingAtom)
  //  get url params
  const params = new URLSearchParams(window.location.search)
  const type = params.get('type')
  console.log(type)
  console.log(path, 'path')

  // states for form data
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);

  const handleSignup = async () => {
    // Handle signup logic with the form data

    if (!checked) {
      showToast('Please check the terms and conditions', 'error')
      return;
    }

    // console.log('Signup Data:', { firstName, lastName, email, password, confirmPassword });
    // check everything is filled
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      showToast('Please fill all the fields', 'error')
      return;
    }

    if (password !== confirmPassword) {
      showToast('Password and confirm password must be same', 'error')
      return;
    }
    // CHECK IF CHECKBOX IS CHECKED FOR TERMS AND CONDITIONS

    setLoading(true)
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_PATH}/users/create`, {
        "firstname": firstName,
        "lastname": lastName,
        "email": email,
        "password": password,
        "type": type ? type : 'customer'
      });


      // console.log(response.data)
      if (response.data) {
        setUserAtom(response?.data?.user);
        navigate('/authenticate');
      } else {
        console.log(response)
        showToast('Something went wrong', 'error')
      }

    } catch (error) {
      showToast('Something went wrong', 'error')
      console.log(error)
    }
    setLoading(false)
  };

  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'bottom',
      }}
      className='w-full h-[100%] flex justify-center flex-col items-center font-main py-8 px-2'>
      <div className='bg-white lg:my-32 w-[100%] max-w-[380px] border bottom-1 flex justify-between flex-col' style={{ boxShadow: '0px 7.204px 36.022px 0px rgba(0, 0, 0, 0.12)' }}>
        {/* tab for switching singin and singup */}
        <div className='flex w-full py-3 text-black'>
          <p className={`text-xl w-[100%] border-b-2 text-center font-normal cursor-pointer`} onClick={() => {
            if (type) {
              if (path.includes('vendor')) {
                navigate(`/vendor-signin?type=${type}`)
              } else {
                navigate(`/signin?type=${type}`)
              }
            } else {
              if (path.includes('vendor')) {
                navigate(`/vendor-signin`)
              } else {
                navigate('/signin')
              }
            }
          }}>
            Sign In
          </p>
          <p className={`text-xl w-[100%] pb-2 text-center font-[600] border-b-4 border-[#A6E66E] cursor-pointer`}>
            Sign Up
          </p>
        </div>
        {/* show different tabs based on selected tab numbers */}
        <div className='flex flex-col px-6 pb-6'>
          <TextField label='First Name' type='text' placeholder='' value={firstName} onChange={setFirstName} />
          <TextField label='Last Name' type='text' placeholder='' value={lastName} onChange={setLastName} />
          <TextField label='Email Address' type='email' placeholder='' value={email} onChange={setEmail} />
          <TextField label='Password' type='password' placeholder='8+ characters' value={password} onChange={setPassword} />
          <TextField label='Confirm Password' type='password' placeholder='' value={confirmPassword} onChange={setConfirmPassword} />
          {/* term and conition */}
          <div className='flex items-center mb-4'>
            <input type='checkbox' className='mr-2 mb-4 w-4 h-4 text-lime-500' onChange={() => setChecked(!checked)} />
            <p className='text-sm text-gray-400'>Are you agree to <span className='text-[#2DA5F3] cursor-pointer'>Terms and Conditions</span> and <span className='text-[#2DA5F3] cursor-pointer'> Privacy Policy.</span></p>
          </div>
          {
            loading == true ?
              // spinner
              <Spinner />
              : <div onClick={handleSignup}>
                <Button text='SIGN UP' />
              </div>
          }

          {/* or */}
          {/* <div className='flex justify-center items-center mt-[20px] mb-[15px]'>
            <div className='w-[100%] h-[1px] bg-gray-300'></div>
            <p className='text-sm text-gray-400 mx-2 mb-1'>or</p>
            <div className='w-[100%] h-[1px] bg-gray-300'></div>
          </div> */}

          {/* google and apple button */}
          {/* <GoogleAndAppleButton type={'google'} text={'Sign up with Google'} />
          <p className='h-4'></p>
          <GoogleAndAppleButton type={'apple'} text={'Sign up with Apple'} /> */}
        </div>
      </div>
    </div>
  )
}

export default Signup