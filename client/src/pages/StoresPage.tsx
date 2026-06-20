import { FC, useEffect, useRef, useState } from "react";
import { YMaps, Map, Placemark } from "@pbe/react-yandex-maps";
import { StoreList, useGetStoresQuery } from "@/features";

export type Address = [number, number];

export const StoresPage: FC = () => {
  const { data, isLoading, isError } = useGetStoresQuery();
  const [selectedAddress, setSelectedAddress] = useState<Address>([55.750712, 37.596148]);

  useEffect(() => {
    if (data) {
      const { lat, lan } = data[0].geo;
      setSelectedAddress([lat, lan]);
    }
  }, [data]);

  const changeAddress = (address: Address) => {
    setSelectedAddress(address);
  };

  return (
    <section className="stores">
      <h1>Наши пиццерии</h1>
      <div className="stores__container">
        <StoreList store={data} changeAddress={changeAddress} />
        <div className="stores__map">
          <YMaps>
            <Map
              state={{
                center: selectedAddress,
                zoom: 16,
              }}
              width="100%"
              height="525px"
            >
              <Placemark
                geometry={selectedAddress}
                options={{
                  preset: "islands#greenIcon",
                }}
              />
            </Map>
          </YMaps>
        </div>
      </div>
    </section>
  );
};
