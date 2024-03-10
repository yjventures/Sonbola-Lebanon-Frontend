import React, { useState } from 'react'
import logoImage from '../../../assets/global/sonbola.svg'
import logoText from 'assets/constant/logo/textSonbola.svg'
import arrowRight from '../../../assets/admin/arrow-right.svg'
import { useNavigate } from 'react-router-dom'
import { MdDashboard } from "react-icons/md";
import { GoArrowRight } from "react-icons/go";
import { RiShoppingBag2Fill } from "react-icons/ri";
import { FaUserFriends } from "react-icons/fa";
import { FaFilterCircleDollar } from "react-icons/fa6";
import { FaShop } from "react-icons/fa6";
import { HiMiniShoppingBag } from "react-icons/hi2";

const AdminSidebar = () => {
    // get path from useLocation
    const path = window.location.pathname;
    console.log(path)
    const navigate = useNavigate();
    const [open, setOpen] = useState(true);
    const [submenuOpen, setSubmenuOpen] = useState(false);
    const [selectedSubmenu, setSelectedSubmenu] = useState('');

    const menus = [
        { title: 'Dashboard', icon: <MdDashboard className={`${!open && 'min-w-5'} text-primary-text-color me-2`} />, link: '/admin-dashboard' },
        {
            title: 'Product', icon: <RiShoppingBag2Fill className={`${!open && 'min-w-5'} text-primary-text-color me-2`} />,
            subMenus: [
                { title: 'Product List', link: '/product-list' },
                { title: 'Category', link: '/product-details' },
                { title: 'Brand', link: '/product-details' },
                { title: 'Review', link: '/product-details' },
            ]
        },
        
        {
            title: 'Customers', icon: <FaUserFriends className={`${!open && 'min-w-5'} text-primary-text-color me-2`} />, subMenus: [
                { title: 'All Customers', link: '/customer-list' },
                { title: 'Verfied Customers', link: '/verified-customer-list' },
                { title: 'Unverfied Customers', link: 'unverified-customer-list' },
            ]
        },
        {
            title: 'Refunds', icon: <FaFilterCircleDollar className={`${!open && 'min-w-5'} text-primary-text-color me-2`} />, subMenus: [
                { title: 'Refund Settings', link: '/refund-settings' },
                { title: 'All Refunds', link: '/refund-list' },
                { title: 'Pending Refunds', link: '/admin-dashboard' },
                { title: 'Approved Refunds', link: '/admin-dashboard' },
                { title: 'Rejected Refunds', link: '/admin-dashboard' },
            ]
        },
        {
            title: 'Vendor', icon: <FaShop className={`${!open && 'min-w-5'} text-primary-text-color me-2`} />, subMenus: [
                { title: 'Vendor List', link: '/vendor-list' },
                { title: 'Pending Vendor', link: '/admin-dashboard' },
                { title: 'Approved Vendor', link: '/admin-dashboard' },
                { title: 'Rejected Vendor', link: '/admin-dashboard' },
            ]
        },
        {
            title: 'Orders', icon: <HiMiniShoppingBag  className={`${!open && 'min-w-5'} text-primary-text-color me-2`} />, subMenus: [
                { title: 'Orders', link: '/all-orders' },
                { title: 'Pending Sellers', link: '/admin-dashboard' },
                { title: 'Approved Sellers', link: '/admin-dashboard' },
                { title: 'Rejected Sellers', link: '/admin-dashboard' },
            ]
        }
    ]
    // console.log(selectedSubmenu)
    return (
        <div className={`w-full duration-300 relative ${open ? 'min-w-[230px]' : 'max-w-[70px]'} bg-gray-900 h-full min-h-dvh py-[40px] font-main `}>
            <div className='mx-4 text-primary-text-color'>
                <div className='flex justify-start items-center gap-2'>
                    <div className={`flex items-center gap-2 cursor-pointer ${open ? 'block' : 'hidden'}`} onClick={() => navigate('/admin-dashboard')}>
                        <img src={logoImage} alt='logo' className='w-[25px] h-[30px]' />
                        <img src={logoText} alt='logo' className='w-[90px] h-[35px]' />
                    </div>
                    {
                        <img src={arrowRight} alt='logo' onClick={() => setOpen(!open)} className={`w-[30px] h-[25px] cursor-pointer ${open && 'ms-5 rotate-180'}`} />
                    }
                </div>
                <ul className='text-primary-text-color mt-10'>
                    {menus.map((item, index) => {
                        const isSelectedMenu = selectedSubmenu === item.title;
                        const hasSubmenus = item.subMenus && item.subMenus.length > 0;

                        return (
                            <div
                                key={index}
                                onClick={() => {
                                    if (hasSubmenus) {
                                        setSubmenuOpen(isSelectedMenu ? !submenuOpen : true);
                                        setSelectedSubmenu(item.title);
                                    } else {
                                        navigate(item.link);
                                        // Keep submenu open when navigating
                                    }
                                }}
                                className={`flex items-center justify-center mt-2 text-primary-text-color hover:text-green-500 hover:bg-gray-800 rounded-md cursor-pointer ${submenuOpen && isSelectedMenu ? 'flex-col' : ''} ${open ? 'px-3' : 'px-1 ps-[10px]'} py-3`}
                            >
                                <p className='text-sm font-medium flex justify-start items-center w-full'>
                                    {
                                        item.icon
                                    }
                                    {/* <MdDashboard  /> */}
                                    {open && <span className={``}>{item.title}</span>}
                                    {hasSubmenus && open && (
                                        <GoArrowRight
                                            className={`w-[15px] h-[15px] cursor-pointer transition ms-auto ${isSelectedMenu && submenuOpen ? 'flex rotate-90 text-[#A6E66E]' : 'block '
                                                }`}
                                        />
                                    )}
                                </p>
                                {submenuOpen && isSelectedMenu && hasSubmenus && open && (
                                    <div className='flex flex-col gap-2 mt-2 w-full'>
                                        {item.subMenus.map((submenuItem, subIndex) => (
                                            <li
                                                key={subIndex}
                                                className={`${subIndex === 0 && 'mt-2'
                                                    } hover:bg-gray-700 rounded-sm transition duration-100 p-2 w-full text-sm font-medium flex justify-start items-center`}
                                                onClick={() => {
                                                    navigate(submenuItem.link);
                                                    // Keep submenu open when navigating
                                                }}
                                            >
                                                <span className='w-1 h-1 bg-gray-100 me-2 rounded-full'></span>
                                                <span className={`text-primary-text-color`}>{submenuItem.title}</span>
                                            </li>
                                        ))}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
}

export default AdminSidebar