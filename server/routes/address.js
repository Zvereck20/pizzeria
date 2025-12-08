import express from "express";
// ⚠️ TODO ENV: перенеси в process.env.* перед продом
const DADATA_URL = "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address";
const DADATA_TOKEN = "5b270c625f9e62e2d9eaefbbbf6ab0b8d8ee628c"; // TODO ENV
const DADATA_SECRET = "685fd7ccc29bf5071df61221a3b2381cbcd619a6"; // TODO ENV

const router = express.Router();

router.get("/suggest", async (req, res, next) => {
  try {
    const query = (req.query.query ?? "").toString();
    const locations = [{ city_fias_id: "a4859da8-9977-4b62-8436-4e1b98c5d13f" }];

    if (!query.trim()) {
      return res.json({ suggestions: [] });
    }

    const addressQuery = await fetch(DADATA_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        // ⚠️ TODO ENV: Authorization/X-Secret
        Authorization: `Token ${DADATA_TOKEN}`,
        "X-Secret": DADATA_SECRET,
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
