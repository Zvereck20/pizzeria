import { FC } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { Slider } from "@/components";

export const Banners: FC = () => {
  const banners = useSelector((s: RootState) => s.banners);

  return (
    <section className="banners">
      <h2 className="visually-hidden">Баннеры</h2>
      <Slider slides={banners} />
    </section>
  );
};
