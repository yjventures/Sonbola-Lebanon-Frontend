import { Fragment, useEffect, useState } from 'react'
import { Dialog } from '@headlessui/react'
import icon from '../../assets/global/sonbola.svg'
import textIcon from 'assets/constant/logo/textSonbola.svg'
import searchIcon from '../../assets/global/search.svg'
import userIcon from '../../assets/global/user.svg'
import wishlistIcon from '../../assets/global/wishlist.svg'
import cartIcon from '../../assets/global/cart.svg'
import { HiXMark } from "react-icons/hi2";
import { HiBars3 } from "react-icons/hi2";
import { IoLogoTwitter } from "react-icons/io";
import { FaArrowRightLong, FaFacebook } from "react-icons/fa6";
import { FaPinterestP } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa";
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import { useAtomValue } from 'jotai'
import { userAtom } from '../../lib/jotai'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'


export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const path = window.location.pathname;
  const user = JSON.parse(localStorage.getItem('user'))
  const token = JSON.parse(localStorage.getItem('token'))
  // console.log(path)
  // const { isPending, data, isError, error } = useQuery({
  //   queryKey: ['count'],
  //   queryFn: async () => {
  //     const response = await axios.get(`${import.meta.env.VITE_API_PATH}/customer-orders/get-infos?${user?.type === 'customer' ? `userId=${user?._id}` : `shopId=${user?.vendor_info?.shop?._id}`}`, {
  //       headers: {
  //         Authorization: `Bearer ${token.accessToken}`
  //       }
  //     })

  //     return response?.data?.info;
  //   }
  // })
  const location = useLocation()
  const [data, setData] = useState([]);

  useEffect(() => {
    const getCount = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_PATH}/customer-orders/get-infos?${user?.type === 'customer' ? `userId=${user?._id}` : `shopId=${user?.vendor_info?.shop?._id}`}`, {
          headers: {
            Authorization: `Bearer ${token.accessToken}`
          }
        });
        setData(response?.data?.info);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    getCount();

    // // Set up interval for auto-refetch every 5 seconds
    // const intervalId = setInterval(() => {
    //   getCount();
    // }, 10000);

    // // Clean up the interval on component unmount
    // return () => clearInterval(intervalId);
  }, [user, token, location.pathname]);


  console.log(data)
  // console.log(path)
  // console.log(user)
  // upper part for social links
  const HeaderUpperPart = () => {
    return (
      <div className='hidden lg:flex lg:justify-between lg:items-center lg:mx-auto max-w-7xl text-primary-text-color px-3 py-2 text-[13px] font-main' >
        <p className=' p-1.5'>
          Welcome to Sonbola online eCommerce store.
        </p>
        {/* social media and language */}
        <div className='p-1.5 flex justify-between items-center'>
          <div className='flex justify-center items-center border-r-2 border-r-gray-500 pr-2'>
            <span>Follow us: </span>
            <a href="#" className='mx-1.5'>
              <IoLogoTwitter className='w-[18px] h-[18px]' />
            </a>
            <a href="#" className='mx-1.5'>
              <FaFacebook className='w-[18px] h-[18px]' />
            </a>
            <a href="#" className='mx-1.5'>
              <FaPinterestP className='w-[18px] h-[18px]' />
            </a>
            <a href="#" className='mx-1.5'>
              <FaYoutube className='w-[18px] h-[18px]' />
            </a>
            <a href="#" className='mx-1.5'>
              <FaInstagram className='w-[18px] h-[18px]' />
            </a>
          </div>

          {/* last part */}
          <div className='flex justify-center items-center border-r-2 border-r-gray-500 px-3'>
            {/* language dropwdown */}
            <select className='bg-header-background focus:outline-none cursor-pointer px-1'>
              <option value="english">
                Eng
              </option>
              <option value="arabic">
                Arabic
              </option>
            </select>
          </div>
          <div className='flex justify-center items-center px-3'>
            {/* currency dropwdown */}
            <select className='bg-header-background focus:outline-none cursor-pointer px-1'>
              <option value="usd" className=''>
                USD
              </option>
              <option value="SAR">
                SAR
              </option>
            </select>
          </div>
          {/* if in user home page */}
          {/* {
            (path == '/home' || path == '/') && <NavLink to='/signup?type=vendor' className='px-3 py-1.5'>
              Become a supplier
            </NavLink>
          } */}
          {
            !user &&
            <NavLink to='/vendor-home' className='px-3 py-1.5'>
              Become a supplier
            </NavLink>
          }

        </div>
      </div>
    )
  }



  // main function
  return (
    <header className="bg-header-background">
      {/* upper part for social links */}
      <HeaderUpperPart />
      {/* main nav */}
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8 font-main" aria-label="Global">
        <div className="flex ">
          <Link to="/" className="-m-1.5 p-1.5 flex gap-2">
            <span className="sr-only">Sonbola</span>
            <img src={icon} alt="icon" className='h-8 w-auto' />
            <img src={textIcon} alt="sonbola" className='h-8 w-24 md:w-28 lg:w-32' />
          </Link>
        </div>
        {/* search bar */}
        <div className='hidden lg:block relative w-[100%] max-w-[700px] '>
          <input type="text"
            name="search"
            className='w-[100%] p-[13px] rounded-sm focus:outline-none'
            placeholder='Search for anything...'
          />
          <img
            src={searchIcon} alt="search-icon"
            className='w-[18px] h-[18px] absolute top-[18px] right-[13px] text-[#364253]'
          />
        </div>

        <div className='flex'>
          {
            user && user.type !== 'vendor' &&
            <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-4">
              {/* cart */}
              <div onClick={() => {
                navigate('/cart')
              }}
                className="text-sm font-semibold leading-6 cursor-pointer relative">
                <img src={cartIcon} alt="user icon" className='w-[28px] h-[28px]' />
                <p className='absolute top-0 -right-1 bg-white text-black rounded-full text-[10px] w-4 h-4 text-center flex justify-center items-center'>
                  {
                    data?.cart_count ? data?.cart_count : 0
                  }
                </p>
              </div>

              {/* wishlist */}
              <div onClick={() => {
                navigate('/wishlist')
              }} className="text-sm font-semibold leading-6 cursor-pointer">
                <img src={wishlistIcon} alt="user icon" className='w-[28px] h-[28px]' />
              </div>
            </div>
          }
          {/* profile */}
          {
            !user ?
              <button
                onClick={() => {
                  navigate('/signin')
                }}
                className='bg-buttons text-primary-text-color text-[12px] font-[700] px-4 py-2 uppercase flex items-center gap-2 transition '>
                Sign in
              </button> :
              <div
                onClick={() => {
                  if (user.type == 'vendor') {
                    if (user.is_approved == true) {
                      navigate('/vendor-dashboard')
                    } else {
                      navigate('/vendor-await-verificaiton')
                    }
                  } else {
                    navigate('/profile')
                  }
                }}
                className="text-sm font-semibold cursor-pointer hidden lg:block ms-2">
                <img src={userIcon} alt="user icon" className='w-[28px] h-[28px]' />
              </div>
          }

          {/* mobile burger */}
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <HiBars3 className="h-6 w-6 text-primary-text-color" aria-hidden="true" />
            </button>
          </div>
        </div>


      </nav>
      {/* search bar for mobile device */}
      {/* <div className='sm:block md:hidden lg:hidden relative w-[100%] max-w-[700px]'>
        <input type="text"
          name="search"
          className='w-[100%] p-[13px] rounded-sm focus:outline-none'
          placeholder='Search for anything...'
        />
        <img
          src={searchIcon} alt="search-icon"
          className='w-[18px] h-[18px] absolute top-[18px] right-[13px] text-[#364253]'
        />
      </div> */}
      {/* mobile version */}
      <Dialog as="div" className="lg:hidden font-main" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />
        <Dialog.Panel className="fixed inset-y-0 right-0 z-10 w-full overflow-y-auto px-6 py-6 bg-header-background sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Sonbola</span>
              <img
                className="h-8 w-auto"
                src={textIcon}
                alt=""
              />
            </a>
            <button
              type="button"
              className="-m-2.5 rounded-md p-2.5 text-primary-text-color"
              onClick={() => setMobileMenuOpen(false)}
            >
              <span className="sr-only">Close menu</span>
              <HiXMark className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y text-primary-text-color">
              <div className="py-6">
                <NavLink to='/cart' className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7" onClick={() => setMobileMenuOpen(false)}>
                  Cart
                </NavLink>
                <NavLink to='/wishlist' className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 " onClick={() => setMobileMenuOpen(false)}>
                  Wishlist
                </NavLink>
                <NavLink to='/profile' className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 " onClick={() => setMobileMenuOpen(false)}>
                  Profile
                </NavLink>

                {/* make this conditional depending on user state */}
                <NavLink to='/signin' className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 " onClick={() => setMobileMenuOpen(false)}>
                  Login
                </NavLink>

                <NavLink to='/signup' className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 " onClick={() => setMobileMenuOpen(false)}>
                  Register
                </NavLink>



                <div className='flex justify-start items-center mt-2'>
                  <span>Follow us: </span>
                  <a href="#" className='mx-1.5'>
                    <IoLogoTwitter className='w-[18px] h-[18px]' />
                  </a>
                  <a href="#" className='mx-1.5'>
                    <FaFacebook className='w-[18px] h-[18px]' />
                  </a>
                  <a href="#" className='mx-1.5'>
                    <FaPinterestP className='w-[18px] h-[18px]' />
                  </a>
                  <a href="#" className='mx-1.5'>
                    <FaYoutube className='w-[18px] h-[18px]' />
                  </a>
                  <a href="#" className='mx-1.5'>
                    <FaInstagram className='w-[18px] h-[18px]' />
                  </a>
                </div>


              </div>
            </div>
          </div>
        </Dialog.Panel>
      </Dialog>
    </header>
  )
}
