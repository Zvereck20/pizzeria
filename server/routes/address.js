import express from "express";

const router = express.Router();

router.get("/suggest", async (req, res, next) => {
  try {
    const query = (req.query.query ?? "").toString();

    if (!query.trim()) {
      return res.json({ suggestions: [] });
    }

    const token = process.env.DADATA_TOKEN;
    const secret = process.env.DADATA_SECRET;

    if (!token || !secret) {
      return res.status(503).json({ message: "Dadata is not configured" });
    }

    const url =
      process.env.DADATA_URL ??
      "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
    const locations = [
      {
        city_fias_id:
          process.env.DADATA_CITY_FIAS_ID ??
          "a4859da8-9977-4b62-8436-4e1b98c5d13f",
      },
    ];

    const addressQuery = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Token ${token}`,
        "X-Secret": secret,
      },
      body: JSON.stringify({ query, locations }),
    });

    const data = await addressQuery.json().catch(() => ({ suggestions: [] }));
    res.status(addressQuery.ok ? 200 : addressQuery.status).json(data);
  } catch (err) {
    next(err);
  }
});

export default router;
