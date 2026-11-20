import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "../docs/swagger.js";
import { publicRouter } from "../route/public.api.js";
import { errorMiddleware } from "../middleware/error.middleware.js";
import { userRouter } from "../route/user.api.js";
import { contactRouter } from "../route/contact.api.js";
import { addressRouter } from "../route/address.api.js";

export const app = express();
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.get("/api-docs.json", (req, res) => {
  res.json(swaggerSpec);
});

app.use(publicRouter);
app.use(userRouter);
app.use(contactRouter);
app.use(addressRouter);
app.use(errorMiddleware);
