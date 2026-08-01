import { FC, useState } from "react";
import {
  useGetVacanciesQuery,
  VacanciesList,
  VacancyModal,
  type VacancyFormValues,
} from "@/features";
import { useSendVacancyEmailMutation } from "@/app/emailApi";
import toast from "react-hot-toast";

export const VacanciesPage: FC = () => {
  const { data } = useGetVacanciesQuery();
  const [isOpen, setIsOpen] = useState(false);
  const [vacancyName, setVacancyName] = useState<string>();
  const [sendVacancyEmail] = useSendVacancyEmailMutation();

  const onConfirmVacancy = (value: string) => {
    setVacancyName(value);
    setIsOpen(true);
  };

  const sendVacancy = async (data: VacancyFormValues) => {
    const { name, email, message } = data;

    try {
      await sendVacancyEmail({
        name,
        email,
        message: message ?? "",
        vacancyName: vacancyName ?? "",
      }).unwrap();

      toast.success("Ваша заявка была отправлена");
    } catch (error) {
      toast.error("Ошибка отправки заявки, попробуйте повторно через несколько минут!");
      console.error("Vacancy email error:", error);
    }
  };

  return (
    <section className="vacancies">
      <h1 className="vacancies__heading">Вакансии</h1>
      <VacanciesList vacancies={data} onApply={onConfirmVacancy} />
      <VacancyModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        vacancyName={vacancyName}
        onSubmitVacancy={sendVacancy}
      />
    </section>
  );
};
