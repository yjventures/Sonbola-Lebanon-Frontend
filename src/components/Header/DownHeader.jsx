import React from 'react'
import tractOrderIcon from '../../assets/global/track-order.svg'
import compareIcon from '../../assets/global/compare.svg'
import supportIcon from '../../assets/global/support.svg'
import helpIcon from '../../assets/global/help.svg'
import phoneIcon from '../../assets/global/phone.svg'
import { showToast } from '../Common/Toastify/Toastify'
import { useNavigate } from 'react-router-dom'

const DownHeader = () => {
    // header buttons
    const HeaderButtons = ({ text }) => {
        const navigate = useNavigate()
        const user = JSON.parse(localStorage.getItem('user'))
        return (
            <button
                onClick={() => {
                    if (text === 'Track Order' && user.type === 'customer') {
                        navigate('orders')
                        return
                    }
                    showToast('This feature is not available yet', 'info')
                }}
                className={text !== 'All Category' ? 'py-3 px-5 text-[#5F6C72] text-[13px] flex items-center justify-center hover:bg-gray-100 transition rounded-sm gap-1' :
                    'bg-gray-100 transition rounded-sm gap-1 py-3 px-5 text-[#5F6C72] text-[13px] flex items-center justify-center font-semibold mr-1'
                }  >
                {
                    text === 'Track Order' ?
                        <img src={tractOrderIcon} alt="icon" className='w-[22px] h-[22px]' /> :
                        text === 'Compare' ?
                            <img src={compareIcon} alt="icon" className='w-[22px] h-[22px]' /> :
                            text === 'Customer Support' ?
                                <img src={supportIcon} alt="icon" className='w-[22px] h-[22px]' /> :
                                text === 'Need Help' ?
                                    <img src={helpIcon} alt="icon" className='w-[22px] h-[22px]' /> :
                                    text === 'Need Help' ?
                                        <img src={phoneIcon} alt="icon" className='w-[22px] h-[22px]' /> : null
                }
                <p>
                    {text}
                </p>
                {/* for category button */}
                {
                    text == 'All Category' &&
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M12.7659 6.24585L8.14616 10.8656L3.52637 6.24585" stroke="#364253" strokeWidth="1.38594" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                }
            </button>
        )
    }
    return (
        <div className='hidden lg:flex lg:justify-between lg:items-center lg:mx-auto max-w-7xl px-3 py-2 text-[13px] bg-primary-color w-[100%]' >
            {/* category links */}
            <div className='flex justify-between items-center'>

                <HeaderButtons text="All Category" />
                <HeaderButtons text="Track Order" />
                <HeaderButtons text="Compare" />
                <HeaderButtons text="Customer Support" />
                <HeaderButtons text="Need Help" />
            </div>

            {/* support links */}
            <a href="tel:+1-202-555-0104" className='mx-1.5 flex gap-1'>
                <img src={phoneIcon} alt="icon" className='w-[22px] h-[22px]' />
                +1-202-555-0104
            </a>
        </div>
    )
}

export default DownHeader