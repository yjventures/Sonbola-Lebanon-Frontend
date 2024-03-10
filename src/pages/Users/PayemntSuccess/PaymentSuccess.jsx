import React from 'react'
import { useNavigate } from 'react-router-dom'
import Stepper from 'src/components/User/Cart/Stepper/Stepper'
import { RiStackLine } from "react-icons/ri";
import { AiTwotoneCheckCircle } from "react-icons/ai";
import { GoCheckCircle } from "react-icons/go";

const PaymentSuccess = () => {
  const navigate = useNavigate()

  return (
    <div className='font-main'>
      <Stepper activeStep={3} />
      <div className="flex flex-col items-center justify-center mb-10 p-2">
        {/* <CheckIcon className="text-green-500 w-16 h-16" /> */}
        <GoCheckCircle  className="text-green-500 w-16 h-16" />
        <h1 className="mt-6 text-2xl font-semibold text-secondary-text-color text-center">Your order is successfully placed</h1>
        <p className="mt-2 text-center text-sm text-gray-500">
          Please check your email for the order confirmation and delivery details
        </p>
        <div className="mt-6 flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0">
          <button className="bg-green-500 text-primary-text-color hover:bg-green-600 w-full sm:w-auto flex items-center justify-center px-4 py-2 rounded-sm transition">
            <RiStackLine className='w-4 h-4 mr-2' />
            Go to Dashboard
          </button>
          <button
            onClick={() => {
              navigate('/orders')
            }}
            className="border border-gray-300 text-primary-text-color bg-secondary-color hover:bg-primary-color hover:text-secondary-text-color w-full sm:w-auto flex items-center justify-center px-4 py-2 rounded-sm transition">
            View Order
            <ArrowRightIcon className="w-4 h-4 ml-2" />
          </button>
        </div>
      </div>
    </div >
  )
}

function ArrowRightIcon(props) {
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
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  )
}

function CheckIcon(props) {
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
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}


export default PaymentSuccess