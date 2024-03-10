import React from 'react'
import categoryImage from 'assets/global/home/category.svg'
import { MdKeyboardArrowRight } from "react-icons/md";

const HomePageCategory = () => {

    const category = [
        {
            title: 'Mobile Phones',
            imageUrl: 'https://www.sahivalue.com/product-images/14+pro+max.jpg/293890000021697778/600x600'
        },
        {
            title: 'Laptops',
            imageUrl: 'https://www.sahivalue.com/product-images/14+pro+max.jpg/293890000021697778/600x600'
        },
        {
            title: 'Headphones',
            imageUrl: 'https://www.sahivalue.com/product-images/14+pro+max.jpg/293890000021697778/600x600'
        },
        {
            title: 'Fashion',
            imageUrl: 'https://cdn.engelbert-strauss.co.uk/assets/pdp/images/Three_MainImage_Crop_Desktop/product/5.Release.7070540/Messenger_Bag_e_s_motion_ten-271548-0-638224987609257822.jpg'
        },
        {
            title: 'Mobile Phones',
            imageUrl: 'https://www.sahivalue.com/product-images/14+pro+max.jpg/293890000021697778/600x600'
        },
        {
            title: 'Laptops',
            imageUrl: 'https://www.sahivalue.com/product-images/14+pro+max.jpg/293890000021697778/600x600'
        },
        {
            title: 'Headphones',
            imageUrl: 'https://www.sahivalue.com/product-images/14+pro+max.jpg/293890000021697778/600x600'
        },
        {
            title: 'Fashion',
            imageUrl: 'https://www.sahivalue.com/product-images/14+pro+max.jpg/293890000021697778/600x600'
        },
        {
            title: 'Mobile Phones',
            imageUrl: 'https://www.sahivalue.com/product-images/14+pro+max.jpg/293890000021697778/600x600'
        },
        {
            title: 'Laptops',
            imageUrl: 'https://www.sahivalue.com/product-images/14+pro+max.jpg/293890000021697778/600x600'
        },
        {
            title: 'Headphones',
            imageUrl: 'https://www.sahivalue.com/product-images/14+pro+max.jpg/293890000021697778/600x600'
        },
        {
            title: 'Fashion',
            imageUrl: 'https://www.sahivalue.com/product-images/14+pro+max.jpg/293890000021697778/600x600'
        }
    ]

    return (
        <div className='font-main'>
            <div className='flex justify-between'>
                <div className='flex gap-2 items-center'>
                    <img src={categoryImage} alt="icon" />
                    <p>Categories</p>
                </div>
                <div className='flex items-center gap-2 cursor-pointer'>
                    <p>View all</p>
                    <MdKeyboardArrowRight />
                </div>
            </div>
            {/* Mapping categories */}
            <div className='grid md:grid-cols-6 grid-cols-2 gap-4 mt-4'>
                {category.map((item, index) => (
                    <div key={index} className='text-center flex justify-start items-center py-2 w-[95%] mx-auto cursor-pointer' style={{
                        boxShadow: '0px 1px 3px 0px #03004717'
                    }} >
                        <img src={item.imageUrl} alt={item.title} className='w-10 h-10 rounded-lg mr-2' />
                        <p>{item.title}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default HomePageCategory