import nodemailer from "nodemailer";

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const getMailConfig = () => {
  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_SECURE,
    SMTP_USER,
    SMTP_PASSWORD,
    SMTP_FROM,
  } = process.env;

  if (
    !SMTP_HOST ||
    !SMTP_PORT ||
    !SMTP_USER ||
    !SMTP_PASSWORD ||
    !SMTP_FROM
  ) {
    throw new Error("SMTP configuration is incomplete");
  }

  const port = Number(SMTP_PORT);

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error("SMTP port is invalid");
  }

  return {
    from: SMTP_FROM,
    transporter: nodemailer.createTransport({
      host: SMTP_HOST,
      port,
      secure: SMTP_SECURE === "true",
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
      },
    }),
  };
};

export const sendOrderNotification = async (order) => {
  const { from, transporter } = getMailConfig();

  if (!process.env.MAIL_ORDER_TO) {
    throw new Error("Order notification recipient is not configured");
  }

  return transporter.sendMail({
    from,
    to: process.env.MAIL_ORDER_TO,
    subject: `Новый заказ №${order.number}`,
    html: `<h1>Оформлен заказ №${escapeHtml(order.number)}</h1><p>Сумма: ${escapeHtml(order.totalPrice)} ₽</p>`,
  });
};

export const sendVacancyNotification = async ({
  name,
  email,
  message,
  vacancyName,
}) => {
  const { from, transporter } = getMailConfig();

  if (!process.env.MAIL_VACANCY_TO) {
    throw new Error("Vacancy notification recipient is not configured");
  }

  const safeMessage = message
    ? `<p>Комментарий: ${escapeHtml(message)}</p>`
    : "<p>Отклик без комментария</p>";

  return transporter.sendMail({
    from,
    to: process.env.MAIL_VACANCY_TO,
    replyTo: email,
    subject: `Отклик на вакансию ${vacancyName}`,
    html: `<h1>Новый отклик на вакансию ${escapeHtml(vacancyName)}</h1><p>Соискатель: ${escapeHtml(name)}</p><p>Email: ${escapeHtml(email)}</p>${safeMessage}`,
  });
};
