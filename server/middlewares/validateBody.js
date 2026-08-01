export function validateBody(schema) {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return res.status(400).json({
        message: "Validation error",
        details: error.details.map(({ message }) => message),
      });
    }

    req.body = value;
    next();
  };
}
