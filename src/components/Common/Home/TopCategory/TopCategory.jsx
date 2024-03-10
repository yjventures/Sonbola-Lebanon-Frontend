import React from 'react'
import offerImage from 'assets/global/home/offer-image.svg'
import topCategoryImage from 'assets/global/home/top-category.png'
import { NavLink } from 'react-router-dom'

const TopCategory = () => {
    const topCategory = [
        {
            type: 'Electronics',
            image: '',
            items: '129'
        },
        {
            type: 'Couple Gift',
            image: '',
            items: '30'
        },
        {
            type: 'Furnitures',
            image: '',
            items: '50'
        }
    ]
    return (
        <div>
            <p className='font-[600] text-[20px] my-2 ms-2'>
                Top New Category
            </p>
            <div className='grid md:grid-cols-3 grid-cols-1 gap-4 place-content-start mt-4'>
                {
                    topCategory.map((item, index) => {
                        return (
                            <NavLink key={index} to='/product-catalog' className='flex flex-col items-center gap-1 ' >
                                <div className=' bg-amber-100 rounded-md w-full'>
                                    <img src={topCategoryImage} alt="image" />
                                </div>
                                <p className='font-[600]'>
                                    {item.type}
                                </p>
                                <p>
                                    {item.items} Available Items
                                </p>
                            </NavLink>
                        )
                    })
                }
            </div>
        </div>
    )
}

export default TopCategory