import type { FC } from "react";
import { Address, PhoneLink } from "../ui";
import { Link } from "react-router-dom";

export const HeaderInfo: FC<{}> = () => (
  <div className="header__info">
    <Address />
    <span className="header__time">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
          stroke="#B4B4B4"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
        <path
          d="M12 6V12L16 14"
          stroke="#B4B4B4"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </svg>
      Доставка с 9:30 до 21:30
    </span>
    <Link to="/stores" className="button button--classic header__stores">
      Наши пиццерии
    </Link>
    <PhoneLink />
  </div>
);
