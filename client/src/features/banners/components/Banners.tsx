import { FC } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/app/store";
import { Slider } from "@/components";
import { useGetBannersQuery } from "../bannersApi";

export const Banners: FC = () => {
  // const banners = useSelector((s: RootState) => s.banners);
  const { data, isSuccess, isError } = useGetBannersQuery();

  if (data === undefined) {
    return <div>Is Error</div>;
  }

  return (
    <section className="banners">
      <h2 className="visually-hidden">Баннеры</h2>
      <Slider slides={data} />
    </section>
  );
};
