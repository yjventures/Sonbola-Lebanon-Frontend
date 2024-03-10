import React, { useRef, useEffect, useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import backGroundPng from 'assets/global/home/bg-image-2.png' // Removed unused import
// import backGroundNew from 'assets/vendor/vendorHero/bg-new.jpg'
import backGround from 'assets/global/home/bg-image.png'
import icon from 'assets/vendor/vendorHero/icon.svg'
import { IoIosArrowRoundForward } from "react-icons/io";
import { IoIosArrowRoundBack } from "react-icons/io";

function HeroCarousel() {
    const sliderRef = useRef();

    const settings = {
        dots: false,
        infinite: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 2000,
        arrows: false,
    };
    const [backgroundImage, setBackgroundImage] = useState(backGround);

    const toggleBackgroundImage = () => {
        setBackgroundImage(previousBackground => previousBackground === backGround ? backGroundPng : backGround);
    };

    const handlePrevClick = () => {
        sliderRef.current.slickPrev();
        toggleBackgroundImage();
    };

    const handleNextClick = () => {
        sliderRef.current.slickNext();
        toggleBackgroundImage();
    };

    const HeroLeftTextSlideOne = () => {
        return (
            <div className="flex flex-col gap-4 p-2 justify-center items-start mt-14 transition-all duration-500">
                <img src={icon} alt="icon" className="w-[60px] h-[90px]" />
                <p className="text-[80px] font-teko max-w-[600px]" style={{
                    lineHeight: '72px'
                }}>
                    Join the legions of sellers with Sonbola!
                </p>
                <button className='bg-buttons text-primary-text-color text-[12px] font-[700] px-4 py-3 uppercase w-[150px]'>
                    Join Now
                </button>
            </div>
        )
    }

    const HeroLeftTextSlideTwo = () => {
        return (
            <div className="flex flex-col gap-4 p-2 justify-center items-start mt-14 transition-all duration-500">
                <img src={icon} alt="icon" className="w-[60px] h-[90px]" />
                <p className="text-[80px] font-teko max-w-[600px]" style={{
                    lineHeight: '72px'
                }}>
                    Make your business more easy and handy!
                </p>
                <button className='bg-[#319848] text-primary-text-color text-[12px] font-[700] px-4 py-3 uppercase w-[150px]'>
                    Explore
                </button>
            </div>
        )
    }

    return (
        <div className="" style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'background-image 0.5s ease-in-out',
            backgroundRepeat: 'no-repeat',

        }}>
            <Slider ref={sliderRef} {...settings} className="max-w-7xl mx-auto relative">
                <div className="h-[500px] relative" >
                    <HeroLeftTextSlideOne />
                    <div className="flex gap-2 p-2 mt-10">
                        <button className="prev bg-[#FAF8F5] py-1 px-4 rounded-sm" onClick={handlePrevClick}>
                            <IoIosArrowRoundBack className="w-6 h-6" />
                        </button>
                        <button className="prev bg-[#FAF8F5] py-1 px-4 rounded-sm" onClick={handleNextClick}>
                            <IoIosArrowRoundForward className="w-6 h-6" />
                        </button>
                    </div>
                </div>
                {/* second slide */}
                <div className="h-[500px] relative">
                    <HeroLeftTextSlideTwo />
                    <div className="flex gap-2 p-2 mt-10">
                        <button className="prev bg-[#FAF8F5] py-1 px-4 rounded-sm" onClick={handlePrevClick}>
                            <IoIosArrowRoundBack className="w-6 h-6" />
                        </button>
                        <button className="prev bg-[#FAF8F5] py-1 px-4 rounded-sm" onClick={handleNextClick}>
                            <IoIosArrowRoundForward className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </Slider>

        </div>
    );
}
export default HeroCarousel;
