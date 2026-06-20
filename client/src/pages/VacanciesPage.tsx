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

  const onComfirmVacancy = (value: string) => {
    setVacancyName(value);
    setIsOpen(true);
  };

  const sendVacancy = async (data: VacancyFormValues) => {
    const { name, email, message } = data;

    const emailVacancy = {
      to: "Zvereck27@yandex.ru",
      subject: `Отклик на вакансию ${vacancyName}`,
      message: `<h1>Соискатель ${name} отправил отклик на вакансию ${vacancyName}</h1><p>Электронная почта сосикателя: ${email}</p>${message ? "Комментарий к вакансии: " + message : "Отклик без комментариев"}`,
    };

    try {
      const emailStatus = await sendVacancyEmail(emailVacancy);

      toast.success("Ваша заявка была отправлена");
      console.log("email-status", emailStatus);
    } catch (error) {
      toast.error("Ошибка отправки заявки, попробуйте повторно через несколько минут!");
      console.log(error);
    }
  };

  return (
    <section className="vacancies">
      <h1 className="vacancies__heading">Вакансии</h1>
      <VacanciesList vacancies={data} onApply={onComfirmVacancy} />
      <VacancyModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        vacancyName={vacancyName}
        onSubmitVacancy={sendVacancy}
      />
    </section>
  );
};
