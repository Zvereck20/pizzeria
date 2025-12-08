import { PAGES_LIST } from "@/pages/config";

export const FooterNav = () => (
  <ul className="footer__nav">
    {PAGES_LIST.map(({ name, link }) => (
      <li key={name} className="footer__item">
        <a href={`#${link}`} className="px-0 py-0 hover:text-red-600 transition-colors">
          {name}{" "}
        </a>
      </li>
    ))}
  </ul>
);
