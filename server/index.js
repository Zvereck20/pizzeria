import mongoose from "mongoose";
import app, { MONGO_URI } from "./app.js";

const PORT = 5000;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    const server = app.listen(PORT, () =>
      console.log(`Server running on port ${PORT}`),
    );

    const shutdown = (signal) => {
      console.log(`${signal} received, closing server`);

      server.close(async (serverError) => {
        if (serverError) {
          console.error("HTTP server close failed", serverError);
          process.exit(1);
        }

        try {
          await mongoose.connection.close();
          console.log("MongoDB connection closed");
          process.exit(0);
        } catch (error) {
          console.error("MongoDB connection close failed", error);
          process.exit(1);
        }
      });
    };

    process.once("SIGTERM", () => shutdown("SIGTERM"));
    process.once("SIGINT", () => shutdown("SIGINT"));
  })
  .catch((err) => {
    console.error("MongoDB connection error");
    process.exit(1);
  });
