import type { FC } from "react";
import { Button } from "@/components";

type Props = {
  value: number;
  onInc: () => void;
  onDec: () => void;
};

export const QuantityControl: FC<Props> = ({ value, onInc, onDec }) => (
  <div className="quantity">
    <Button type="button" variant="classic" onClick={onDec} aria-label="Уменьшить">
      -
    </Button>
    <span className="quantity__value">{value}</span>
    <Button type="button" variant="classic" onClick={onInc} aria-label="Увеличить">
      +
    </Button>
  </div>
);
