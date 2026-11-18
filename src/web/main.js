import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerDocument } from "../docs/swagger.js";
import { publicRouter } from "../route/public.api.js";
import { errorMiddleware } from "../middleware/error.middleware.js";
import { userRouter } from "../route/user.api.js";
import { contactRouter } from "../route/contact.api.js";
import { addressRouter } from "../route/address.api.js";
import { rateLimitMiddleware } from "../middleware/rate-limit.middleware.js";

export const app = express();
app.use(express.json());
app.use(rateLimitMiddleware());

app.get("/api-docs.json", (req, res) => {
  res.json(swaggerDocument);
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(publicRouter);
app.use(userRouter);
app.use(contactRouter);
app.use(addressRouter);
app.use(errorMiddleware);
