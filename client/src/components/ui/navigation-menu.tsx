import { categoryLabels, type Category } from "@/features/products/constants/categories";

const NAV_CATEGORY: Category[] = [
  "pizza",
  "combo",
  "salad",
  "soup",
  "paste",
  "appetizers",
  "rolls",
  "dessert",
  "drink",
];

export const NavigationMenu = () => (
  <nav className="menu">
    <ul className="menu__list">
      {NAV_CATEGORY.map((cat) => (
        <li className="menu__item" key={cat}>
          <a href={`#${cat}`} className="menu__link">
            {categoryLabels[cat]}
          </a>
        </li>
      ))}
    </ul>
  </nav>
);
