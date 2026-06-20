import { FC, useEffect, useState } from "react";
import type { Store } from "../storeApi";
import { Address } from "@/pages";

interface StoreListProps {
  store: Store[] | undefined;
  changeAddress: (address: Address) => void;
}

export const StoreList: FC<StoreListProps> = ({ store, changeAddress }) => {
  const [selectedStore, setSelectedStore] = useState<Store>();
  const activeStore = store?.filter((s) => s?.isActive === true);

  useEffect(() => {
    if (activeStore?.length) {
      setSelectedStore(activeStore[0]);
    }
  }, [store]);

  const onHandleClick = (s: Store) => {
    setSelectedStore(s);
    changeAddress([s.geo.lat, s.geo.lan]);
  };

  return (
    <div className="stores__wrap">
      <div className="stores__content">
        <h2 className="stores__title">{selectedStore?.address}</h2>
        <ul className="stores__info">
          <li>
            <span>Режим работы:</span>
            <p>{selectedStore?.operating_mode}</p>
          </li>
          <li>
            <span>Телефон:</span>
            <a className="stores__phone" href={`tel:${selectedStore?.phone}`}>
              {selectedStore?.phone}
            </a>
          </li>
          <li>
            <span>Кухня:</span>
            <a className="stores__menu" target="_blank" href={selectedStore?.menu}>
              Ознакомиться с меню
            </a>
          </li>
        </ul>
      </div>
      <div className="stores__list">
        {activeStore?.map((s) => (
          <button
            key={s._id}
            type="button"
            className="stores__item"
            onClick={() => onHandleClick(s)}
          >
            {s.address}
          </button>
        ))}
      </div>
    </div>
  );
};
