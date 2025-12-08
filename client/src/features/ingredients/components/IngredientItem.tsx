import type { FC, KeyboardEventHandler } from "react";
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components";
import { formatPrice } from "@/lib/format";

export type IngredientItemProps = {
  id: string;
  name: string;
  image?: string;
  price?: number;
  available?: boolean;
  checked: boolean;
  onToggle: (id: string) => void;
  className?: string;
};

export const IngredientItem: FC<IngredientItemProps> = ({
  id,
  name,
  image,
  price = 0,
  available = true,
  checked,
  onToggle,
  className,
}) => {
  const disabled = available === false;

  const handleClick = () => {
    if (!disabled) onToggle(id);
  };

  const onKeyDown: KeyboardEventHandler<HTMLButtonElement> = (e) => {
    if (disabled) return;
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      onToggle(id);
    }
  };

  // return (
  //   <TooltipProvider delayDuration={100}>
  //     <Tooltip>
  //       <TooltipTrigger asChild>
  //         <button
  //           type="button"
  //           role="checkbox"
  //           aria-checked={checked}
  //           aria-disabled={disabled}
  //           onClick={handleClick}
  //           onKeyDown={onKeyDown}
  //           disabled={disabled}
  //           className={[
  //             "group relative aspect-square w-full overflow-hidden rounded-md border transition bg-white",
  //             disabled
  //               ? "cursor-not-allowed border-gray-300 opacity-50"
  //               : checked
  //               ? "border-emerald-500 ring-2 ring-emerald-400"
  //               : "border-gray-200 hover:border-gray-400",
  //             className ?? "",
  //           ].join(" ")}
  //         >
  //           <img src={image} alt={name} className="h-full w-full object-contain p-2" loading="lazy" decoding="async" />

  //           {/* цена / статус */}
  //           <span className="pointer-events-none absolute bottom-1 right-1 rounded bg-black/70 px-1.5 py-0.5 text-[11px] font-medium text-white">
  //             {disabled ? "нет" : `+ ${formatPrice(price)}`}
  //           </span>

  //           {/* бейдж выбора */}
  //           <span
  //             className={[
  //               "pointer-events-none absolute left-1 top-1 rounded px-1.5 py-0.5 text-[11px] font-medium",
  //               checked ? "bg-emerald-500 text-white" : "bg-white/80 text-gray-700 opacity-0 group-hover:opacity-100",
  //             ].join(" ")}
  //           >
  //             {checked ? "выбран" : "добавить"}
  //           </span>
  //         </button>
  //       </TooltipTrigger>

  //       <TooltipContent side="top" sideOffset={6} className="text-xs">
  //         {name}
  //       </TooltipContent>
  //     </Tooltip>
  //   </TooltipProvider>
  // );

  return <h2>Halo ibgredient</h2>;
};
