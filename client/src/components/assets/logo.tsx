import type { FC } from "react";
import { Link } from "react-router-dom";

export const Logo: FC<{ isLink?: boolean }> = ({ isLink = true }) => (
  <div className="logo">
    {isLink ? (
      <Link to="/" aria-label="На главную">
        <img src="/images/logo.png" alt="Pizzeria" />
      </Link>
    ) : (
      <img src="/images/logo.png" alt="Pizzeria" />
    )}
  </div>
);
