import React from 'react'
import Header from '../../components/Header/Header'
import Footer from '../../components/Footer/Footer'
import Motivation from 'src/components/Common/Home/Motivation/Motivation'
import VendorHomeInfo from 'src/components/Vendor/VendorHome/VendorHomeInfo'
import HomePageCategory from 'src/components/Common/Home/HomePageCategory/HomePageCategory'
import FlashSale from 'src/components/Common/Home/FlashSale/FlashSale'
import MostViewed from 'src/components/Common/Home/MostViewed/MostViewed'
import OfferSlider from 'src/components/Common/Home/OfferSlider/OfferSlider'
import MoreProducts from 'src/components/Common/Home/MoreProducts/MoreProducts'
import HeroCarousel from 'src/components/Common/Home/HeroCarousel/HeroCarousel'
import NewsLetter from 'src/components/Common/NewsLetter/NewsLetter'
import CategorySidebar from 'src/components/Common/Home/CategorySidebar/CategorySidebar'
import offerImage from 'assets/global/home/offer-image.svg'
import TopCategory from 'src/components/Common/Home/TopCategory/TopCategory'


const Home = () => {

  return (
    <div className=' bg-primary-color'>
      <HeroCarousel />
      <div className='max-w-7xl mx-auto py-10 px-2'>
        <div className='grid md:grid-cols-12 grid-cols-1 gap-3'>
          <div className='md:col-span-3 col-span-12 h-full'>
            <CategorySidebar />
          </div>
          <div className='md:col-span-9 col-span-12 flex flex-col gap-4 ' >
            <Motivation length={3} />
            {/* offer image */}
            <div className='grid grid-cols-2 gap-4'>
              <img src={offerImage} alt="offer-image" />
              <img src={offerImage} alt="offer-image" />
            </div>
            {/* top new categories */}
            <TopCategory />
          </div>
        </div>

        <FlashSale />
        <MostViewed />
        <OfferSlider />
        <MoreProducts />
        <OfferSlider />
      </div>
      <NewsLetter />
    </div>
  )
}

export default Home