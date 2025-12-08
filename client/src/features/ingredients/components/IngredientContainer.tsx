import type { FC } from "react";
import { IngredientItem } from "./IngredientItem";

export type IngredientView = {
  _id: string;
  name: string;
  image?: string;
  price?: number;
  available?: boolean;
};

export type IngredientsContainerProps = {
  items: IngredientView[];
  selectedIds: string[];
  onToggle: (id: string) => void;
  className?: string;
  cols?: string; // tailwind классы колонок, по умолчанию адаптивная сетка
};

export const IngredientsContainer: FC<IngredientsContainerProps> = ({
  items,
  selectedIds,
  onToggle,
  className,
  cols = "grid grid-cols-3 gap-3 md:grid-cols-4",
}) => (
  <div className={[cols, className ?? ""].join(" ")}>
    {items.map((ing) => (
      <IngredientItem
        key={ing._id}
        id={ing._id}
        name={ing.name}
        image={ing.image}
        price={ing.price ?? 0}
        available={ing.available}
        checked={selectedIds.includes(ing._id)}
        onToggle={onToggle}
      />
    ))}
  </div>
);
