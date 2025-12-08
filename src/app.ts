import express from "express";
import routes from "./routes";
import errorMiddleware from "./middlewares/error.middleware";
import requestLogger from "./middlewares/requestLogger.middleware";

const app = express();
app.use(express.json());
app.use(requestLogger);

app.use("/api", routes);

app.use(errorMiddleware);

export default app;
