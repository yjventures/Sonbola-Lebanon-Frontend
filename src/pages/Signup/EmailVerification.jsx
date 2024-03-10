import React, { useState } from 'react'
import TextField from '../../components/Signup/TextField'
import Button from '../../components/Signup/Button'
import { NavLink, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAtomValue } from 'jotai'
import { verifyEmailAtom } from '../../lib/jotai'
import { showToast } from '../../components/Common/Toastify/Toastify'
import background from 'assets/constant/background/bg-image.png'
import ReactCodeInput from 'react-code-input'

const EmailVerification = () => {
    const [code, setCode] = useState('')
    const navigate = useNavigate()
    const email = useAtomValue(verifyEmailAtom)
    const [userId, setUserId] = useState('')

    // console.log(email)
    const handleVerify = async () => {
        if (code === '') {
            showToast('Please enter your verification code', 'error')
            return
        }

        const response = await axios.post(`${import.meta.env.VITE_API_PATH}/users/verify-otp`, {
            "email": email,
            "code": code
        })
        if (response.status === 200) {
            showToast('Email verified successfully', 'success')
            navigate(`/reset-password?userId=${response.data.userId}`)
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
                <h2 className='text-center text-[#191C1F] font-[600] text-[20px] mt-[32px] mb-[12px]'>
                    Verify Your Email Address
                </h2>
                <p className='text-center px-3 pb-[24px] text-gray-600'>

                    Please verify your email address by typing the code sent to your inbox.
                </p>
                {/* text field */}
                <div className='flex flex-col px-6 pb-6'>
                    <div className='relative flex justify-center'>
                        <ReactCodeInput
                            type='text'
                            fields={4} style={{
                                height: '50px',
                                marginBottom: '30px',
                            }}
                            onChange={setCode}
                        />
                        {/* <TextField label='Verification Code' type='text' placeholder='' value={code} onChange={setCode} /> */}

                    </div>
                    <div onClick={handleVerify}>
                        <Button text='VERIFY ME' />
                    </div>
                    <p
                        className='text-sm text-[#2DA5F3] text-center mt-2  font-[600] cursor-pointer'
                        onClick={() => {
                            showToast('Resend code api here', 'info')
                        }}
                    >
                        Resend Code
                    </p>
                </div>
            </div>
        </div>
    )
}

export default EmailVerification