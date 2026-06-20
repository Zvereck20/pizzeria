import express from "express";
import nodemailer from "nodemailer";

const router = express.Router();

const transporter = nodemailer.createTransport({
  host: "smtp.yandex.ru",
  port: 465,
  secure: true,
  auth: {
    user: "Zvereck27@yandex.ru",
    pass: "phenifbjekqqsjhf",
  },
});

router.post("/order", async (req, res) => {
  const { to, subject, message } = req.body;

  const defoultMessage = {
    from: "Zvereck27@yandex.ru",
    to,
    subject,
    html: message,
  };

  try {
    const info = await transporter.sendMail(defoultMessage);
    res.status(200).json({
      status: "success",
      message: "Email sent successfully",
      info: info.messageId,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.post("/vacancy", async (req, res) => {
  const { to, subject, message } = req.body;

  console.log("message", message);

  const defoultMessage = {
    from: "Zvereck27@yandex.ru",
    to,
    subject,
    html: message,
  };

  try {
    const info = await transporter.sendMail(defoultMessage);
    res.status(200).json({
      status: "success",
      message: "Email sent successfully",
      info: info.messageId,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
