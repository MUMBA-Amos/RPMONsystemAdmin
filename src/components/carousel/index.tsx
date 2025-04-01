import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Navigation, Thumbs } from "swiper";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { Carousel, CarouselProps } from "antd";

interface IProps extends CarouselProps {
  children: React.ReactNode;
  // slidesPerView?: number;
  // onSwiper?: any;
  // swiper?: any;
  // freeMode?: boolean;
  // navigation?: boolean;
  // watchSlidesProgress?: boolean;
}
export const ApImageSlider: React.FC<IProps> = (props: IProps) => {
  return (
    // <>
    //   <Swiper
    //     style={{}}
    //     spaceBetween={10}
    //     navigation={navigation}
    //     thumbs={{ swiper }}
    //     modules={[FreeMode, Navigation, Thumbs]}
    //     grabCursor={true}
    //     // className="bg-sky-500"
    //     onSwiper={onSwiper}
    //     slidesPerView={1}
    //     freeMode={freeMode}
    //     watchSlidesProgress={watchSlidesProgress}
    //     // loop
    //   >
    //     {children}
    //   </Swiper>
    // </>
    <Carousel dotPosition={"bottom"} {...props}>
      {props.children}
    </Carousel>
  );
};
