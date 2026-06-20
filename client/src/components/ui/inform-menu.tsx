import { FC } from "react";
import { Link } from "react-router-dom";

type InfromCategory = "about" | "vacancies" | "stores" | "legal-infromation";

const categoryLabels: { id: InfromCategory; label: string }[] = [
  { id: "about", label: "О нас" },
  { id: "vacancies", label: "Вакансии" },
  { id: "stores", label: "Наши пиццерии" },
];

export const InformMenu: FC = () => (
  <nav className="sub-menu">
    <ul className="sub-menu__list">
      {categoryLabels.map(({ id, label }) => (
        <li className="sub-menu__item" key={id}>
          <Link to={`/${id}`} className="sub-menu__link">
            {label}
          </Link>
        </li>
      ))}
    </ul>
  </nav>
);
