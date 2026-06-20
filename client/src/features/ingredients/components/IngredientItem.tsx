import type { FC, KeyboardEventHandler } from "react";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components";
import { formatPrice } from "@/lib/format";

export type IngredientItemProps = {
  _id: string;
  name: string;
  image?: string;
  price?: number;
  available?: boolean;
  checked: boolean;
  onToggle: (id: string) => void;
};

export const IngredientItem: FC<IngredientItemProps> = ({
  _id,
  name,
  image,
  price = 0,
  available = true,
  checked,
  onToggle,
}) => {
  const disabled = available === false;

  const handleClick = () => {
    if (!disabled) onToggle(_id);
  };

  const onKeyDown: KeyboardEventHandler<HTMLButtonElement> = (e) => {
    if (disabled) return;
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onToggle(_id);
    }
  };

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-disabled={disabled}
      onClick={handleClick}
      onKeyDown={onKeyDown}
      disabled={disabled}
      // className="ingredient"
      className={`${checked ? "ingredient ingredient--checked" : "ingredient"}`}
    >
      <img
        src={image}
        alt={name}
        className="ingredient__image"
        loading="lazy"
        decoding="async"
      />
      <h4 className="ingredient__title">{name}</h4>
      <span className="ingredient__price">
        {disabled ? "нет" : `+ ${formatPrice(price)}`}
      </span>

      {/* <span className="ingredient__choise">{checked ? "выбран" : "добавить"}</span> */}
    </button>
  );
};
