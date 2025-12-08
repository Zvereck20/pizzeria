/**
 * @param {string|undefined|null} file
 * @param {import('express').Request} req
 * @param {string} basePath
 * @returns {string|null}
 */
export const urlFor = (file, req, basePath = "/uploads") => {
  if (!file) return null;
  return `${req.protocol}://${req.get("host")}${basePath}/${file}`;
};

/**
 * Преобразовать поля изображений в документе/объекте в абсолютные URL
 *
 * @param {object} doc - Mongoose Document или plain object
 * @param {import('express').Request} req
 * @param {Array<{ path: string, field: string }>} mapping
 *    path: "" — корень объекта, "ingredients" — вложенный массив/объект
 *    field: имя поля с именем файла, которое нужно превратить в URL
 *
 * Примеры mapping:
 *  - [{ path: "", field: "image" }] — только корневое поле image
 *  - [{ path: "", field: "image" }, { path: "ingredients", field: "image" }] — корневое и в каждой сущности массива ingredients
 */
export const mapImages = (doc, req, mapping) => {
  const out = typeof doc.toObject === "function" ? doc.toObject() : { ...doc };

  for (const m of mapping) {
    // корень
    if (!m.path) {
      if (out?.[m.field]) out[m.field] = urlFor(out[m.field], req);
      continue;
    }

    const target = out[m.path];

    // массив объектов
    if (Array.isArray(target)) {
      out[m.path] = target.map((item) => {
        const obj = typeof item.toObject === "function" ? item.toObject() : { ...item };
        if (obj?.[m.field]) obj[m.field] = urlFor(obj[m.field], req);
        return obj;
      });
      continue;
    }

    // вложенный объект
    if (target && typeof target === "object") {
      const obj = typeof target.toObject === "function" ? target.toObject() : { ...target };
      if (obj?.[m.field]) obj[m.field] = urlFor(obj[m.field], req);
      out[m.path] = obj;
    }
  }

  return out;
};
