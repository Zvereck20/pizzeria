interface Product {
  _id: string;
  name: string;
  description: string;
  image: string; // заменить, фото должно находиться в проекте
  category: "pizza" | "combo" | "salad" | "soup" | "paste" | "appetizers" | "rolls" | "dessert" | "drink";
  price: number;
  ingredients: string[];
  available: boolean;
}
