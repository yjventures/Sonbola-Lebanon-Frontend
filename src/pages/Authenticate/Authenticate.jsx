import axios from "axios";
import { useSetAtom } from "jotai";
import { useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom"
import { userAtom } from "../../lib/jotai";
import { showToast } from "../../components/Common/Toastify/Toastify";

export default function Authenticate() {
    // check token from params
    const token = useParams().token;
    // console.log(token)
    // if email and token is present in url then hit new api to verify email
    const navigate = useNavigate();
    const userData = useSetAtom(userAtom)
    // function to send email verification request
    const verifyEmail = async () => {
        try {
            const response = await axios.put(`${import.meta.env.VITE_API_PATH}/auth/verify`, {
                token
            })
            // {
            //     status: 'success',
            //     data: {
            //       adddresses: [],
            //       _id: '65a11240bf4fcc309599c59a',
            //       firstname: 'mahinur',
            //       lastname: 'Rahman',
            //       email: 'mahi121.mr@gmail.com',
            //       password: '$2b$13$S4ASJ0zJ1jZW0pDlfM2/Qu/Gljqdu8nACYlUdeIJUgpZs6CgIo1/e',
            //       is_verified: true,
            //       is_first_time: true,
            //       is_approved: false,
            //       type: 'vendor',
            //       reviews: [],
            //       orders: [],
            //       createdAt: '2024-01-12T10:19:44.718Z',
            //       updatedAt: '2024-01-12T10:20:22.249Z',
            //       __v: 0
            //     }
            //   }
            // console.log(response.data)
            if (response.data.status == 'success') {
                userData(response.data.data)
                showToast('Email verified successfully', 'success')
                if (response.data.data.type == 'vendor') {
                    navigate('/signin?type=vendor')
                } else {
                    navigate('/signin')
                }
                // // check if user is vendor
                // // save user data 
                // if (response.data.data.type == 'vendor') {
                //     console.log('type vendor')
                //     if (response.data.data.is_first_time == true) {
                //         console.log('is_first_time true')
                //         navigate('/vendor-step-one')
                //     } else {
                //         // check if vendor is approved from admin
                //         console.log('is_first_time true')
                //         if (response.data.data.is_approved == false) {
                //             console.log('is_approved false')
                //             navigate('/vendor-await-verificaiton')
                //         } else {
                //             navigate('/vendor-home')
                //         }
                //     }

                // } else if (response.data.data.type == 'customer') {
                //     navigate('/profile')
                // }

            } else {
                showToast('Something went wrong, Please re-check email', 'error')
                navigate('/signup')
            }
        } catch (error) {
            showToast('Something went wrong', 'error')
            navigate('/signup')
        }
    }
    const initialized = useRef(false)
    // once token is found then hit api to verify email
    useEffect(() => {
        if (!initialized.current) {
            initialized.current = true
            if (token) {
                verifyEmail()
            }
        }
    }, [token])

    return (
        <main className="flex flex-col items-center justify-center min-h-screen bg-gray-50  px-4 sm:px-6 lg:px-8 font-main">
            <div className="max-w-md w-full space-y-8 flex justify-center items-center flex-col">
                {
                    token ?
                        <p className="text-center">Please wait, we are verifying your email</p>
                        : <div>
                            <MailIcon className="mx-auto h-12 w-auto" />
                            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                                Check your email
                            </h2>
                            <p className="mt-2 text-center text-sm text-gray-600">
                                We have sent a verification email to your registered email address. Please check your email and follow the
                                instructions provided to complete the verification process.
                            </p>
                        </div>
                }

            </div>
        </main>
    )
}

function MailIcon(props) {
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
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
    )
}
