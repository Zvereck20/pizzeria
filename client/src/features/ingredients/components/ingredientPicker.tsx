import type { FC } from "react";
import { ScrollArea, Separator } from "@/components";
import { IngredientsContainer, type IngredientView } from "./IngredientContainer";

export type IngredientsPickerProps = {
  title?: string;
  items: IngredientView[];
  selectedIds: string[];
  onChange: (ids: string[]) => void;
  className?: string;
  scrollHeightClass?: string; // например "h-[260px]"
};

export const IngredientsPicker: FC<IngredientsPickerProps> = ({
  title = "Ингредиенты",
  items,
  selectedIds,
  onChange,
  className,
  scrollHeightClass = "h-[260px]",
}) => {
  const onToggle = (id: string) => {
    if (selectedIds.includes(id)) {
      onChange(selectedIds.filter((x) => x !== id));
    } else {
      onChange([...selectedIds, id]);
    }
  };

  return (
    <div className={className}>
      <h4 className="mb-2 text-sm font-semibold">{title}</h4>
      <ScrollArea className={`${scrollHeightClass} pr-2`}>
        <IngredientsContainer items={items} selectedIds={selectedIds} onToggle={onToggle} />
      </ScrollArea>
      <Separator className="mt-3" />
    </div>
  );
};
