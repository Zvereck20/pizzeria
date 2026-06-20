import { FC, useEffect, useState } from "react";
import type { Vacancy } from "../vacanciesApi";
import { Button } from "@/components/ui";

interface VacanciesProps {
  vacancies: Vacancy[] | undefined;
  onApply: (vacancyName: string) => void;
}

type VacanciesStatus = { [key: string]: boolean };

export const VacanciesList: FC<VacanciesProps> = ({ vacancies, onApply }) => {
  const [isOpen, setIsOpen] = useState<VacanciesStatus>();
  const activeVacancies = vacancies?.filter((v) => v.isActive === true);

  useEffect(() => {
    let status: VacanciesStatus = {};
    activeVacancies?.map(({ _id }) => {
      status[_id] = false;
    });

    setIsOpen(status);
  }, [vacancies]);

  const onHandleClick = (id: string) => {
    setIsOpen((prev) => ({
      ...prev,
      [id]: !prev![id],
    }));
  };

  return (
    <ul className="vacancies__list">
      {activeVacancies?.map(({ _id, name, description }) => (
        <li
          className={`vacancies__item ${isOpen![_id] ? "is-open" : "is-close"}`}
          key={_id}
        >
          <h3 className="vacancies__title" onClick={() => onHandleClick(_id)}>
            {name}
          </h3>
          <div className="vacancies__wrap">
            <div
              className="vacancies__description"
              dangerouslySetInnerHTML={{ __html: description }}
            />
            <Button variant="classic" type="button" onClick={() => onApply(name)}>
              Откликнуться
            </Button>
          </div>
        </li>
      ))}
    </ul>
  );
};
