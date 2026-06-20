import type { FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, A11y } from "swiper/modules";
import { Banner } from "@/features";

import "swiper/css";
import "swiper/css/bundle";

type SliderProps = {
  slides: Banner[] | undefined;
  autoPlay?: boolean;
  autoPlayDelayMs?: number;
};

export const Slider: FC<SliderProps> = ({
  slides,
  autoPlay = false,
  autoPlayDelayMs = 0,
}) => {
  return (
    <Swiper
      modules={[Pagination, Autoplay, A11y]}
      loop
      pagination={{ clickable: true }}
      spaceBetween={30}
      slidesPerView={5}
      autoplay={
        autoPlay
          ? {
              delay: autoPlayDelayMs,
              disableOnInteraction: true,
              pauseOnMouseEnter: true,
            }
          : false
      }
      breakpoints={{
        0: { slidesPerView: 1 },
        640: { slidesPerView: 2 },
        768: { slidesPerView: 3 },
        1024: { slidesPerView: 4 },
        1280: { slidesPerView: 5 },
      }}
      speed={500}
      a11y={{ enabled: true }}
    >
      {slides?.map((s) => (
        <SwiperSlide key={s._id} className="banners__slide">
          {s.link ? (
            <a href={s.link}>
              <img src={s.image} loading="lazy" decoding="async" />
            </a>
          ) : (
            <img src={s.image} loading="lazy" decoding="async" />
          )}
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
