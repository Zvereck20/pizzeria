import type { FC } from "react";
import { Button } from "@/components";

type Props = {
  style: string;
  value: number;
  onInc: () => void;
  onDec: () => void;
};

export const QuantityControl: FC<Props> = ({ style, value, onInc, onDec }) => (
  <div className={`quantity ${style}`}>
    <button
      className="quantity__button quantity__button--minus"
      type="button"
      onClick={onDec}
      aria-label="Уменьшить"
    >
      –
    </button>
    <span className="quantity__value">{value}</span>
    <button
      className="quantity__button quantity__button--plus"
      type="button"
      onClick={onInc}
      aria-label="Увеличить"
    >
      +
    </button>
  </div>
);
