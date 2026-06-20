import type { FC } from "react";
import { useMatch } from "react-router-dom";
import { useCompactHeader } from "./useCompactHeader";
import { HeaderInfo } from "./HeaderInfo";
import { NavigationMenu, Logo, InformMenu } from "@/components";
import { CartSummary } from "@/features";

export const Header: FC = () => {
  const compact = useCompactHeader(12);
  const match = !useMatch("/");

  return (
    <header className={`header ${compact ? "header--shadow" : ""}`} role="banner">
      <div className="header__container">
        <Logo isLink={match} />
        <HeaderInfo />
        <CartSummary />
      </div>
      <NavigationMenu />
    </header>
  );
};
