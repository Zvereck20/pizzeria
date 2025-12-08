import type { FC } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components";

type Props = {
  value: number;
  onInc: () => void;
  onDec: () => void;
};

export const QuantityControl: FC<Props> = ({ value, onInc, onDec }) => (
  <div className="inline-flex items-center gap-2">
    <Button type="button" size="icon" variant="outline" onClick={onDec} aria-label="Уменьшить">
      <Minus className="h-4 w-4" />
    </Button>
    <span className="w-8 text-center tabular-nums">{value}</span>
    <Button type="button" size="icon" variant="outline" onClick={onInc} aria-label="Увеличить">
      <Plus className="h-4 w-4" />
    </Button>
  </div>
);
