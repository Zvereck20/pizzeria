import type { FC } from "react";

export const Logo: FC<{ isLink?: boolean }> = ({ isLink = true }) => (
  <div className="logo">
    {isLink ? (
      <a href="/" aria-label="На главную">
        <img
          src="https://c8.alamy.com/compde/2g4tt1e/pizza-logo-emblem-fur-fast-food-restaurant-pizzeria-caf-vektorgrafik-2g4tt1e.jpg"
          alt="Pizzeria"
        />
      </a>
    ) : (
      <img
        src="https://c8.alamy.com/compde/2g4tt1e/pizza-logo-emblem-fur-fast-food-restaurant-pizzeria-caf-vektorgrafik-2g4tt1e.jpg"
        alt="Pizzeria"
      />
    )}
  </div>
);
