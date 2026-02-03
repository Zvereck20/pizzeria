import type { FC } from "react";
import { IngredientItem, type IngredientItemProps } from "./IngredientItem";

export type IngredientsPickerProps = {
  items: Omit<IngredientItemProps, "checked" | "onToggle">[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
};

export const IngredientsPicker: FC<IngredientsPickerProps> = ({
  items,
  selectedIds,
  onChange,
}) => {
  const onToggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((x) => x !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  return (
    <div className="ingredients">
      <h3 className="ingredients__title">Ингредиенты</h3>

      <div className="ingredients__wrap">
        {items.map((ing) => (
          <IngredientItem
            key={ing._id}
            _id={ing._id}
            name={ing.name}
            image={ing.image}
            price={ing.price ?? 0}
            available={ing.available}
            checked={selectedIds.includes(ing._id)}
            onToggle={onToggle}
          />
        ))}
      </div>
    </div>
  );
};
