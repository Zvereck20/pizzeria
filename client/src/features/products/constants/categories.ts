export type Category =
  | "pizza"
  | "combo"
  | "salad"
  | "soup"
  | "paste"
  | "appetizers"
  | "rolls"
  | "dessert"
  | "drink";

export const categoryLabels: { id: Category; label: string }[] = [
  { id: "pizza", label: "Пиццы" },
  { id: "combo", label: "Комбо" },
  { id: "salad", label: "Салаты" },
  { id: "soup", label: "Супы" },
  { id: "paste", label: "Паста" },
  { id: "appetizers", label: "Закуски" },
  { id: "rolls", label: "Роллы" },
  { id: "dessert", label: "Десерты" },
  { id: "drink", label: "Напитки" },
];
