import type { FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, A11y } from "swiper/modules";
import { Banner } from "@/features";

import "swiper/css";
import "swiper/css/bundle";

export interface SlideItem extends Banner {
  link?: string;
  alt?: string;
}

type SliderProps = {
  slides: SlideItem[];
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
      modules={[Navigation, Pagination, Autoplay, A11y]}
      loop
      navigation
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
      {slides.map((s) => (
        <SwiperSlide key={s._id}>
          {/* Пропорциональная высота и растяжение по ширине */}
          {/* <div className={`relative w-full overflow-hidden rounded-xl bg-neutral-100`}> */}
          {/* <div> */}
          {s.link ? (
            <a href={s.link} aria-label={s.alt ?? "Слайд"}>
              <img
                src={s.image}
                alt={s.alt ?? ""}
                className="h-full w-full object-contain"
                loading="lazy"
                decoding="async"
              />
            </a>
          ) : (
            <img
              src={s.image}
              alt={s.alt ?? ""}
              className="h-full w-full object-contain"
              loading="lazy"
              decoding="async"
            />
          )}
          {/* </div> */}
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
