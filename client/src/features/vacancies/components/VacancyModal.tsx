import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FC } from "react";
import { useForm, SubmitHandler, Resolver } from "react-hook-form";
import ReactModal from "react-modal";

const vacancySchema = yup
  .object({
    name: yup.string().trim().min(2, "Введите имя полностью").required("Имя обязательно"),
    email: yup
      .string()
      .trim()
      .email("Не правильный адресс электронной почты")
      .required("Электронная почта обязательна"),
    message: yup
      .string()
      .trim()
      .transform((value) => (value === "" ? undefined : value))
      .notRequired(),
  })
  .required();

export type VacancyFormValues = yup.InferType<typeof vacancySchema>;

type VacancyFormRHFValues = {
  name: string;
  email: string;
  message?: string;
};

interface VacancyModalProps {
  isOpen: boolean;
  setIsOpen: (type: boolean) => void;
  vacancyName: string | undefined;
  onSubmitVacancy: (payload: VacancyFormValues) => void;
}

export const VacancyModal: FC<VacancyModalProps> = ({
  isOpen,
  setIsOpen,
  vacancyName,
  onSubmitVacancy,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VacancyFormRHFValues>({
    mode: "onTouched",
    resolver: yupResolver(vacancySchema) as Resolver<VacancyFormRHFValues>,
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onClose = () => {
    setIsOpen(false);
    reset();
  };

  const onSubmit: SubmitHandler<VacancyFormRHFValues> = (data) => {
    const payload: VacancyFormValues = {
      name: data.name,
      email: data.email,
      message: data.message,
    };
    onSubmitVacancy(payload);
    onClose();
  };

  return (
    <ReactModal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={"modal__content"}
      overlayClassName={"modal__overlay"}
    >
      <div className="vacancy-modal">
        <button
          type="button"
          className="modal__close"
          aria-label="Закрыть"
          onClick={onClose}
        >
          ×
        </button>
        <h2>Заполните вакансию: {vacancyName}</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label>Имя</label>
            <input {...register("name")} />
            {errors.name && (
              <span className="vacancy-modal__error">{errors.name.message}</span>
            )}
          </div>

          <div>
            <label>Email</label>
            <input {...register("email")} />
            {errors.email && (
              <span className="vacancy-modal__error">{errors.email.message}</span>
            )}
          </div>

          <div>
            <label>Сообщение</label>
            <textarea {...register("message")} />
            {errors.message && (
              <span className="vacancy-modal__error">{errors.message.message}</span>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="button button--classic"
          >
            Отправить
          </button>
        </form>
      </div>
    </ReactModal>
  );
};
