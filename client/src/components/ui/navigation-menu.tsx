import { Link, useLocation, useNavigate } from "react-router-dom";
import { categoryLabels } from "@/features/products/constants/categories";
import { useEffect } from "react";

export const NavigationMenu = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const id = location.state ? location.state.scrollTo : null;

    if (id) {
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  }, [location.state]);

  const toScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();

    if (location.pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/", { state: { scrollTo: id } });
    }
  };

  return (
    <nav className="menu">
      <ul className="menu__list">
        {categoryLabels.map(({ id, label }) => (
          <li className="menu__item" key={id}>
            <Link to={`#${id}`} className="menu__link" onClick={(e) => toScroll(e, id)}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
