import type { FC } from "react";
import { Button } from "@/components/ui";
import { Address } from "../ui/address";
import { PhoneLink } from "../ui/phone-link";
import { CartSummary } from "@/features";

export const HeaderInfo: FC<{ compact?: boolean }> = ({ compact }) => (
  <div className="header__info">
    <Address />
    <span className="header__time">Доставка с 9:30 до 21:30</span>
    <Button variant="classic" onClick={() => {}}>
      Наши пиццерии
    </Button>
    <PhoneLink />
    <CartSummary />
  </div>
);
