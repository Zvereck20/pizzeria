interface Page {
  name: string;
  link: string;
}
export const PAGES_LIST: Page[] = [
  { name: "О нас", link: "/about" },
  { name: "Вакансии", link: "/vacancies" },
  { name: "Наши пиццерии", link: "/resorants" },
  { name: "Правовая информация", link: "/gooverment" },
];
