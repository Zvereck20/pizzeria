import type { FC } from "react";
import { useMatch, useParams } from "react-router-dom";
import { useCompactHeader } from "./useCompactHeader";
import { HeaderInfo } from "./HeaderInfo";
import { NavigationMenu } from "@/components/ui";
import { Logo } from "@/components/assets";

export const Header: FC = () => {
  const compact = useCompactHeader(12);
  const match = !useMatch("/");

  return (
    <header className={`header ${compact ? "header--shadow" : ""}`} role="banner">
      <div className="header__container">
        <Logo isLink={match} />
        <HeaderInfo compact={compact} />
      </div>
      <NavigationMenu />
      {/* <HeaderMobile /> */}
    </header>
  );
};
