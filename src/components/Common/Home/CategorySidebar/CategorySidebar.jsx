import React from 'react';
import { HiOutlineHome } from "react-icons/hi2";
import { TfiCup } from "react-icons/tfi";
import { NavLink } from 'react-router-dom';
import { IoIosTrendingUp } from "react-icons/io";
import { BsListTask } from "react-icons/bs";
import { IoIosLaptop } from "react-icons/io";
import { PiPottedPlantThin } from "react-icons/pi";
import { MdKeyboardArrowRight } from "react-icons/md";
import { Popover, Transition } from '@headlessui/react';

const CategorySidebar = () => {
    const [activeItem, setActiveItem] = React.useState(null);

    const ListItem = ({ icon, text, link, options }) => {
        const IconComponent = {
            HiOutlineHome,
            TfiCup,
            IoIosTrendingUp,
            BsListTask,
            IoIosLaptop,
            PiPottedPlantThin,
        }[icon];

        const PopoverContent = () => (
            <div className="bg-[#FAF8F5] rounded-lg shadow-md p-2">
                {topCategory.map((item, index) => (
                    <ListItem key={index} icon={item.icon} text={item.text} link={item.link} options={item.options} />
                ))}
            </div>
        );

        const isOpen = activeItem === text;

        return (
            <>
                {
                    options ? (
                        <div className="relative ">
                            <div
                                className='flex justify-between items-center cursor-pointer w-full hover:bg-zinc-100 px-2 py-2 transition'
                                onMouseEnter={() => setActiveItem(text)}
                           
                            >
                                <div className='flex justify-between items-center gap-4'>
                                    {IconComponent ? <IconComponent className='w-4 h-4' /> : null}
                                    <p>{text}</p>
                                </div>
                                <MdKeyboardArrowRight className='text-gray-400' />
                            </div>
                            <Transition
                                show={isOpen}
                                enter="transition ease-out duration-200"
                                enterFrom="opacity-0"
                                enterTo="opacity-100"
                                leave="transition ease-in duration-150"
                                leaveFrom="opacity-100"
                                leaveTo="opacity-0"
                            >
                                <div className="absolute z-10 -right-[210px] top-0">
                                    <PopoverContent />
                                </div>
                            </Transition>
                        </div>
                    ) : (
                        <NavLink to={link} className='flex justify-between items-center cursor-pointer hover:bg-zinc-100 px-2 py-2 transition'  >
                            <div className='flex justify-between items-center gap-4'>
                                {IconComponent ? <IconComponent className='w-4 h-4' /> : null}
                                <p>{text}</p>
                            </div>
                        </NavLink>
                    )
                }
            </>
        );
    };

    const topCategory = [
        {
            icon: 'HiOutlineHome',
            text: 'Home',
            link: '/home',
            options: false
        },
        {
            icon: 'TfiCup',
            text: 'Popular Products',
            link: '/popular-products',
            options: false
        },
        {
            icon: 'IoIosTrendingUp',
            text: 'Trending Products',
            link: '/trending-products',
            options: false
        },
        {
            icon: 'BsListTask',
            text: 'All Products',
            link: '/all-products',
            options: false
        },
    ];

    const allCategory = [
        {
            icon: 'IoIosLaptop',
            text: 'Electronics',
            link: '/electronics',
            options: true
        },
        {
            icon: 'PiPottedPlantThin',
            text: 'Home & Garden',
            link: '/home-garden',
            options: true
        }
    ];

    return (
        <div className='bg-primary-category rounded-md py-6 font-main px-2' onMouseLeave={() => setActiveItem(null)}>
            <p className='text-[16px] font-[600]'>Top Categories</p>
            <p className='h-[1px] bg-[#319848] border-b-2 border-dashed my-3' />

            {topCategory.map((item, index) => (
                <ListItem key={index} icon={item.icon} text={item.text} link={item.link} options={item.options} />
            ))}

            <p className='text-[16px] font-[600] mt-3'>Categories</p>
            <p className='h-[1px] bg-[#319848] border-b-2 border-dashed my-3' />

            {allCategory.map((item, index) => (
                <ListItem key={index} icon={item.icon} text={item.text} link={item.link} options={item.options} />
            ))}
        </div>
    );
}

export default CategorySidebar;