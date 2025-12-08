export type Category = "pizza" | "combo" | "salad" | "soup" | "paste" | "appetizers" | "rolls" | "dessert" | "drink";

export const categoryLabels: Record<Category, string> = {
  pizza: "🍕 Пиццы",
  combo: "🥡 Комбо",
  salad: "🥗 Салаты",
  soup: "🍲 Супы",
  paste: "🍝 Паста",
  appetizers: "🥟 Закуски",
  rolls: "🍣 Роллы",
  dessert: "🍰 Десерты",
  drink: "🥤 Напитки",
};

export const categoryOrder: Category[] = ["pizza", "combo", "salad", "soup", "paste", "appetizers", "rolls", "dessert", "drink"];
