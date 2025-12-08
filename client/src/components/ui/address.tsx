import { FC } from "react";
import { MapPin } from "../assets/map-pin";

export const Address: FC<{ compact?: boolean }> = () => (
  <div className="address">
    <MapPin />
    Нижний Новгород
  </div>
);
