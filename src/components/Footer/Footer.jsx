import React from 'react'
import icon from '../../assets/global/sonbola.svg'
import textIcon from 'assets/constant/logo/textSonbola.svg'
import googlePlay from '../../assets/global/google-play.svg'
import appStore from '../../assets/global/app-store.svg'
import { GrFacebookOption } from "react-icons/gr";
import { FaTwitter } from "react-icons/fa";
import { IoLogoInstagram } from "react-icons/io";
import { AiOutlineYoutube } from "react-icons/ai";
import { IoLogoGoogle } from "react-icons/io";

const Footer = () => {

  const navigation = {
    about: [
      { name: 'Careers', href: '#' },
      { name: 'Our Stores', href: '#' },
      { name: 'Our Cares', href: '#' },
      { name: 'Terms & Conditions', href: '#' },
      { name: 'Privacy Policy ', href: '#' },
    ],
    customerCare: [
      { name: 'Help Center', href: '#' },
      { name: 'How to Buy', href: '#' },
      { name: 'Track Your Order', href: '#' },
      { name: 'Corporate & Bulk Purchasing', href: '#' },
      { name: 'Returns & Refunds', href: '#' },
    ],
    contact: [
      { name: 'Address: SAUDI ARABIA, Habibi, 12/A', href: '#' },
      { name: 'Oil Company of Riyad', href: '#' },
      { name: 'Email: test@test.com', href: '#' },
      { name: 'Phone: +880 1111 111 111', href: '#' },
    ],
    social: [
      { name: 'GrFacebookOption', href: '#' },
      { name: 'FaTwitter', href: '#' },
      { name: 'IoLogoInstagram', href: '#' },
      { name: 'AiOutlineYoutube', href: '#' },
      { name: 'IoLogoGoogle', href: '#' },
    ]

  }
  return (
    <footer className="bg-footer-background" aria-labelledby="footer-heading">
      <div className="mx-auto max-w-7xl px-6 py-[100px] sm:py-24 lg:px-8 lg:py-32">
        <div className="mt-16 grid grid-cols-2 gap-2 md:gap-8 xl:col-span-2 xl:mt-0">
          <div className="md:grid md:grid-cols-2 md:gap-8">
            {/* left column */}
            <div className='px-1'>
              <div className='flex gap-4'>
                <img
                  className="h-7"
                  src={icon}
                  alt="Company name"
                />
                <img
                  className="h-7 w-[80px] md:w-[150px]"
                  src={textIcon}
                  alt="Company name"
                />
              </div>
              <p className='text-gray-300 text-balance my-6' style={{ lineHeight: '30px' }} >
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Auctor libero id et, in gravida. Sit diam duis mauris nulla cursus. Erat et lectus vel ut sollicitudin elit at amet.
              </p>
              <div className='hidden gap-2 flex-wrap lg:flex'>
                {/* play store button */}
                <a href="https://play.google.com/store/apps/details?id=com.sonbola.app" target='_blank'>
                  <img
                    className="sm:h-[40px] md:h-[50px] sm:w-[80px] md:w-[120px] cursor-pointer"
                    src={googlePlay}
                    alt="google-play-download"
                  />
                </a>
                {/* app store button */}
                <a href="https://play.google.com/store/apps/details?id=com.sonbola.app" target='_blank'>
                  <img
                    className="sm:h-[40px] md:h-[50px] sm:w-[80px] md:w-[120px] cursor-pointer"
                    src={appStore}
                    alt="app-store-download"
                  />

                </a>
              </div>
            </div>
            <div className="mt-10 md:mt-0 ml-0 md:ml-8">
              <h3 className="text-xl font-semibold leading-6 text-primary-text-color">About Us</h3>
              <ul role="list" className="mt-6 space-y-4">
                {navigation.about.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="text-sm leading-6 text-gray-300 hover:text-primary-text-color">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="md:grid md:grid-cols-2 md:gap-8">
            <div>
              <h3 className="text-xl font-semibold leading-6 text-primary-text-color">Customer Care</h3>
              <ul role="list" className="mt-6 space-y-4">
                {navigation.customerCare.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="text-sm leading-6 text-gray-300 hover:text-primary-text-color">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-10 md:mt-0">
              <h3 className="text-xl font-semibold leading-6 text-primary-text-color">Contact Us</h3>
              <ul role="list" className="mt-6 space-y-4">
                {navigation.contact.map((item) => (
                  <li key={item.name}>
                    <a href={item.href} className="text-sm leading-6 text-gray-300 hover:text-primary-text-color">
                      {item.name}
                    </a>
                  </li>
                ))}
              </ul>
              <ul role="list" className="flex justify-start items-center flex-wrap gap-3 text-primary-text-color mt-3">
                {navigation.social.map((item) => (
                  <li key={item.name} className='bg-gray-600 p-2 rounded-full cursor-pointer hover:bg-gray-500 transition' >
                    {/* make it dynamic */}
                    {
                      item.name == 'GrFacebookOption' ? <GrFacebookOption className='w-[18px] h-[18px]' /> : item.name == 'FaTwitter' ? <FaTwitter className='w-[18px] h-[18px]' /> : item.name == 'IoLogoInstagram' ? <IoLogoInstagram className='w-[18px] h-[18px]' /> : item.name == 'AiOutlineYoutube' ? <AiOutlineYoutube className='w-[18px] h-[18px]' /> : <IoLogoGoogle className='w-[18px] h-[18px]' />
                    }
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className='flex justify-between gap-2 flex-wrap lg:hidden mt-10'>
          <a href="https://play.google.com/store/apps/details?id=com.sonbola.app" target='_blank'>
            <img
              className="sm:h-[40px] md:h-[50px] sm:w-[100px] md:w-[120px] cursor-pointer"
              src={googlePlay}
              alt="google-play-download"
            />
          </a>
          {/* app store button */}
          <a href="https://play.google.com/store/apps/details?id=com.sonbola.app" target='_blank'>
            <img
              className="sm:h-[40px] md:h-[50px] sm:w-[100px] md:w-[120px] cursor-pointer"
              src={appStore}
              alt="app-store-download"
            />

          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer