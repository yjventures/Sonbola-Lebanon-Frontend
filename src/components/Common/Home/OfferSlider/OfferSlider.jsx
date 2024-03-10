import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import bgOne from 'assets/global/home/offer.svg'

function OfferSlider() {

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 2000,
    };

    return (
        <Slider {...settings}>
            <div >
                <div
                    className="rounded-sm flex justify-center items-center flex-col"
                    style={{
                        background: `url(${bgOne}) no-repeat center / cover`,
                        height: '418px'
                    }}
                >
                    <p className="text-[#7D879C]">
                        Summer Offer!
                    </p>
                    <p className="text-[#2B3445] md:text-[50px] text-[30px] font-[700]">
                        30% off for All Items
                    </p>
                    <button className='bg-[#319848] text-primary-text-color text-[12px] font-[700] px-4 py-3 uppercase w-[150px] mt-4'>
                        Join Now
                    </button>
                </div>
            </div>
            <div>
                <div
                    className="rounded-sm flex justify-center items-center flex-col"
                    style={{
                        background: `url(${bgOne}) no-repeat center / cover`,
                        height: '418px'
                    }}
                >
                    <p className="text-[#7D879C]">
                        Flash Sale
                    </p>
                    <p className="text-[#2B3445] md:text-[50px] text-[30px] font-[700]">
                        20% off for All Items
                    </p>
                    <button className='bg-[#319848] text-primary-text-color text-[12px] font-[700] px-4 py-3 uppercase w-[150px] mt-4'>
                        Join Now
                    </button>
                </div>
            </div>
            <div>
                <div
                    className="rounded-sm flex justify-center items-center flex-col"
                    style={{
                        background: `url(${bgOne}) no-repeat center / cover`,
                        height: '418px'
                    }}
                >
                    <p className="text-[#7D879C]">
                        New Year Offer
                    </p>
                    <p className="text-[#2B3445] md:text-[50px] text-[30px] font-[700]">
                        Upto 45% off for All Items
                    </p>
                    <button className='bg-[#319848] text-primary-text-color text-[12px] font-[700] px-4 py-3 uppercase w-[150px] mt-4'>
                        Join Now
                    </button>
                </div>
            </div>
        </Slider >
    );
}

export default OfferSlider;
