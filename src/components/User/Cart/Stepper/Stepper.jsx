import React from 'react'

const Stepper = ({activeStep}) => {

    // const [activeStep, setActiveStep] = React.useState(0)
    const steps = ['Cart', 'Delivery Info', 'Payment', 'Review']

    return (
        <div className='hidden md:flex justify-center items-center my-[45px] '>
            {
                steps.map((step, index) => {
                    return (
                        <div key={index} className='flex justify-center items-center'>
                            <div className={`px-6 py-2 font-[600] flex justify-center items-center rounded-full ${activeStep >= index ? ' bg-green-600 text-primary-text-color' : 'bg-[#DCF3E8] text-[#1A985B]'}`}>
                                <p>{index + 1 +'. ' + step}</p>
                            </div>
                            {
                                index !== steps.length - 1 && <div className={`w-12 w-max-[70px] h-1 bg-[#DCF3E8] ${activeStep > index  && 'bg-green-600'}`}></div>
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Stepper