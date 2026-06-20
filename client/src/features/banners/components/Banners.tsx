import { FC } from "react";
import { ErrorBlock, Slider } from "@/components";
import { useGetBannersQuery } from "../bannersApi";

export const Banners: FC = () => {
  const { data, isError } = useGetBannersQuery();

  if (isError) return <ErrorBlock />;

  return (
    <section className="banners">
      <h2 className="visually-hidden">Баннеры</h2>
      <Slider slides={data} />
    </section>
  );
};
