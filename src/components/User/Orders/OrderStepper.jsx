import React from 'react'
import { TfiPackage } from "react-icons/tfi";
import { LiaShippingFastSolid } from "react-icons/lia";
import { BsGift } from "react-icons/bs";

const OrderStepper = ({ activeStep, estimation_date, deliveryStatus }) => {
  // const [activeStep, setActiveStep] = React.useState(0)
  const steps = ['Packaging', 'Shipping', 'Delivery']
  console.log(deliveryStatus)
  return (
    <div className='flex justify-center items-center my-[15px] pt-10 pb-28 relative'
    >
      {
        deliveryStatus === 'delivered' ?
          <p className='bg-green-100 text-sm text-[#1A985B] font-[600] absolute bottom-6 md:right-28 px-4 py-2 rounded-full w-[200px] md:w-[330px] text-center'>
            Delivered
          </p>
          :
          <p className='bg-green-100 text-sm text-[#1A985B] font-[600] absolute bottom-6 md:right-28 px-4 py-2 rounded-full w-[200px] md:w-[330px] text-center'>
            Estimated Delivery Date {new Date(estimation_date).getDate()} {new Date(estimation_date).toLocaleString('default', { month: 'short' })}, {new Date(estimation_date).getFullYear()}
          </p>
      }
      {
        steps.map((step, index) => {
          return (
            <div className='mx-auto relative'>
              <div key={index} className='flex justify-center items-center flex-col '>
                <div className={`font-[600] flex justify-center items-center rounded-full w-[64px] h-[64px] ${activeStep >= index ? ' bg-green-600 text-primary-text-color' : 'bg-[#DCF3E8] text-[#1A985B]'}`}>
                  {
                    step === 'Packaging' ? <TfiPackage className='w-5 h-5' /> : step === 'Shipping' ? <LiaShippingFastSolid className='w-6 h-6' /> : <BsGift className='w-5 h-5' />
                  }
                </div>
                <p>
                  {step}
                </p>
              </div>
              {
                index !== steps.length - 1 && <hr className={`h-[3px] w-[70px] sm:w-[200px] md:w-[220px] absolute top-[35%] left-[98%] ${activeStep > index ? 'bg-green-600 text-primary-text-color' : 'bg-[#DCF3E8] text-[#1A985B]'} `} />
              }
            </div>
          )
        })
      }

    </div>
  )
}

export default OrderStepper