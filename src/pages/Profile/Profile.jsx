import React from 'react'
import ProfileSidebar from '../../components/Profile/ProfileSidebar/ProfileSidebar';
import profileIcon from '../../assets/profile/profile.svg'
import { IoReorderThreeOutline } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';
import UserDetails from '../../components/Profile/UserDetails/UserDetails';
import { useAtomValue } from 'jotai';
import { userAtom } from '../../lib/jotai';

const Profile = () => {
    const [showSidebar, setShowSidebar] = React.useState(false)
    const navigate = useNavigate()
    const user = useAtomValue(userAtom)



    return (
        <div className='h-full p-3 font-main lg:-ms-10'>
            <div className='lg:flex justify-between items-center relative'>
                <div className='flex items-center'>
                    <img src={profileIcon} alt="icon" />
                    <p className='text-xl font-bold ms-2'>My Profile</p>
                </div>
                <div className='lg:hidden absolute top-0 right-2'>
                    <IoReorderThreeOutline className='w-[20px] h-[20px]' onClick={() => {
                        setShowSidebar(!showSidebar)
                    }} />
                </div>
                <div className='lg:hidden'>
                    {
                        showSidebar && <ProfileSidebar />
                    }
                </div>

                <button
                    onClick={() => {
                        navigate('/edit-profile')
                    }}
                    className='border-2 border-[#1A985B] text-[#1A985B] px-[20px] py-[6px] rounded-sm text-[16px] font-[600] hover:text-primary-text-color hover:bg-[#1A985B] transition my-4 lg:mt-0'>Edit Profile
                </button>
            </div>
            <UserDetails />
        </div>
    )
}

export default Profile