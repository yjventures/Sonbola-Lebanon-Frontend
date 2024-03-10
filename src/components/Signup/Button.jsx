import React from 'react'
import arrow from '../../assets/signup/arrow.svg'

const Button = ({text}) => {
  return (
    <div className='w-[100%] bg-[#2DB224] hover:bg-[#50bb48] transition flex justify-center items-center text-primary-text-color h-[44px] cursor-pointer rounded-sm'>
        {text}
        <img src={arrow} alt="arrow" className='ms-2'/>
    </div> 
  )
}

export default Button