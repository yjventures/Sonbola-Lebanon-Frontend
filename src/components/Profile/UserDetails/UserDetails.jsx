import React from 'react'
import profileIcon from '../../../assets/profile/profile.svg'
import { useAtomValue } from 'jotai'
import { userAtom } from '../../../lib/jotai'

const UserDetails = () => {
    const user = useAtomValue(userAtom)
    // console.log(user)
    
    const InfoBox = ({ text, number }) => {
        return (
            <div className='flex flex-col justify-center items-center rounded-md py-2' style={{
                boxShadow: '0px 1px 3px 0px rgba(3, 0, 71, 0.09)'
            }}>
                <p className='text-[20px] font-[600] text-[#1A985B]'>{number}</p>
                <p className='text-[12px] text-[#7D879C] text-center'>{text}</p>
            </div>
        )
    }

    // format birthdate
    const formatBirthdate = (birthdate) => {
        var birthdayDate = new Date(birthdate);
        // Options for formatting
        var options = { day: 'numeric', month: 'numeric', year: 'numeric' };
        // Format the Date object
        var formattedBirthday = birthdayDate.toLocaleDateString('en-US', options);
        return formattedBirthday;
    }

    // main function
    return (
        <div className='flex flex-col justify-start items-start gap-16 lg:gap-2 font-main'>
            <div div className='grid grid-cols-1 lg:grid-cols-2 h-[90px] max-h-[150px] gap-2 w-full mb-10 lg:mb-0' >
                <div className='flex justify-between items-center px-[24px] py-[12px] rounded-md flex-wrap' style={{
                    boxShadow: '0px 1px 3px 0px rgba(3, 0, 71, 0.09)'
                }}>
                    <div className='flex gap-2 items-center rounded-md justify-between '>
                        {
                            user?.image ? <img src={user?.image} alt="icon" className='w-[64px] h-[64px] rounded-full' /> : <img src={profileIcon} alt="icon" className='w-[64px] h-[64px] rounded-full' />
                        }
                        <div className=''>
                            <p className='text-[16px] font-[600]'>{(user?.firstname && user?.lastname ) && user?.firstname + ' ' + user?.lastname}</p>
                            <p className='text-[12px]'>
                                <span className='text-gray-600 '>Balance</span>
                                <span className='text-[#1A985B] font-bold'> $500 </span>
                            </p>
                        </div>
                    </div>
                    {/* <p className='tracking-[2px] font-[14px] text-gray-500 '>
                        SILVER USER
                    </p> */}
                </div>
                <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 lg:mt-0'>
                    <InfoBox text='Orders' number='0' />
                    <InfoBox text='Awaiting Payments' number='0' />
                    <InfoBox text='Awaiting Shipment' number='0' />
                    <InfoBox text='Awaiting Delivery' number='0' />
                </div>
            </div >
            {/* lower part */}
            <div className='w-full grid grid-cols-2 lg:grid-cols-5 gap-4 px-2 lg:px-4 py-[24px] rounded-md mt-20 lg:mt-4' style={{
                boxShadow: '0px 1px 3px 0px rgba(3, 0, 71, 0.09)'
            }}>
                <div className='text-[12px]'>
                    <p className='text-[#7D879C]'>First Name</p>
                    <p className='text-gray-900'>{user?.firstname ? user?.firstname : 'Loading...'}</p>
                </div>
                <div className='text-[12px]'>
                    <p className='text-[#7D879C]'>Last Name</p>
                    <p className='text-gray-900'>{user?.lastname ? user?.lastname : 'Loading...'}</p>
                </div>
                <div className='text-[12px]'>
                    <p className='text-[#7D879C]'>Email</p>
                    <p className='text-gray-900'>{user?.email ? user?.email : 'Loading...'}</p>
                </div>
                <div className='text-[12px]'>
                    <p className='text-[#7D879C]'>Phone</p>
                    <p className='text-gray-900'>{user?.phone ? user?.phone : 'Not provided'}</p>
                </div>
                <div className='text-[12px]'>
                    <p className='text-[#7D879C]'>Birth Date</p>
                    <p className='text-gray-900'>{user?.birthdate ? formatBirthdate(user.birthdate) : 'Not provided'}</p>
                </div>
            </div>
        </div>
    )
}

export default UserDetails