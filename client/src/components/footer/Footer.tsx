import { FC } from "react";
import { Logo } from "../assets/logo";
import { Address } from "../ui/address";
import { PhoneLink } from "../ui/phone-link";
import { FooterNav } from "./FooterNav";

export const Footer: FC = () => (
  <footer className="footer">
    <div className="footer__wrap">
      <Logo />
      <FooterNav />
    </div>
    <ul className="footer__container">
      <li>
        <h3>Why do we use it?</h3>
        <p>
          It is a long established fact that a reader will be distracted by the readable
          content of a page when looking at its layout. The point of using Lorem Ipsum is
          that it has a more-or-less normal distribution of letters, as opposed to using
          'Content here, content here',
        </p>
      </li>
      <li>
        <h3>Why do we use it?</h3>
        <p>
          It is a long established fact that a reader will be distracted by the readable
          content of a page when looking at its layout. The point of using Lorem Ipsum is
          that it has a more-or-less normal distribution of letters, as opposed to using
          'Content here, content here',
        </p>
      </li>
      <li>
        <Address />
        <PhoneLink />
      </li>
    </ul>
  </footer>
);
