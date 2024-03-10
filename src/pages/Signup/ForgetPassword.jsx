import React, { useState } from 'react'
import TextField from '../../components/Signup/TextField'
import Button from '../../components/Signup/Button'
import { NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useSetAtom } from 'jotai'
import { verifyEmailAtom } from '../../lib/jotai'
import { showToast } from '../../components/Common/Toastify/Toastify'
import background from 'assets/constant/background/bg-image.png'

const ForgetPassword = () => {
    const [email, setEmail] = useState('')
    const navigate = useNavigate()
    const setverifyEmail = useSetAtom(verifyEmailAtom)
    // console.log(email)
    const handleSendCode = async () => {
        if (email === '') {
            showToast('Please enter your email address', 'error')
            return
        }
        // validate email
        const emailRegex = /\S+@\S+\.\S+/
        if (!emailRegex.test(email)) {
            showToast('Please enter a valid email address', 'error')
            return
        }
        // set email in jotai
        setverifyEmail(email)
        // calling api
        const response = await axios.post(`${import.meta.env.VITE_API_PATH}/users/forget-password`, { email: email })
        if (response.status === 200) {
            showToast('Email sent successfully', 'success')
            navigate('/email-verificaiton')
        } else {
            showToast('Something went wrong', 'error')
        }
    }

    return (
        <div
            style={{
                backgroundImage: `url(${background})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: 'bottom',
            }}
            className='w-full h-[100%] flex justify-center flex-col items-center py-[53px] font-main'>
            <div className='bg-white w-[100%] max-w-[380px] flex justify-between flex-col' style={{ boxShadow: '0px 7.204px 36.022px 0px rgba(0, 0, 0, 0.12)' }}>
                {/* header part */}
                <h2 className='text-center text-[#191C1F] font-[600] text-[20px] mt-[32px] mb-[12px]'>
                    Forget Password
                </h2>
                <p className='text-center px-3 pb-[24px] text-gray-600'>
                    Enter the email address which is associated with your account.
                </p>

                <div className='flex flex-col px-6 pb-6'>
                    {/* text field */}
                    <TextField label='Email Address' type='email' placeholder='' value={email} onChange={setEmail} />
                    <div onClick={handleSendCode}>
                        <Button text='SEND CODE' />
                    </div>

                    {/* extra links */}
                    <div className='text-[14px] space-y-1 my-[24px] pb-6 border-b-2 border-gray-200'>
                        <p className='text-gray-600'>
                            Already have account? <NavLink to="/signin" className='text-[#2DA5F3] font-[500]'>Sign in</NavLink>
                        </p>
                        <p className='text-gray-600'>
                            Don’t have account? <NavLink to="/signup" className='text-[#2DA5F3] font-[500]'>Sign up</NavLink>
                        </p>
                    </div>
                    <p className='text-[14px] text-gray-600'>
                        You may contact <NavLink to={'/customerService'} style={{ color: "#2DB224", fontWeight: 600 }}>Customer Service</NavLink> for help restoring access to your account.
                    </p>

                </div>
            </div>
        </div>
    )
}

export default ForgetPassword