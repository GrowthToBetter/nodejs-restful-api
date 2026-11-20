import express from "express";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec, swaggerUiOptions } from "../docs/swagger.js";
import { docsRouter } from "../docs/docs.router.js";
import { docsAuthMiddleware } from "../docs/docs.middleware.js";
import { publicRouter } from "../route/public.api.js";
import { errorMiddleware } from "../middleware/error.middleware.js";
import { userRouter } from "../route/user.api.js";
import { contactRouter } from "../route/contact.api.js";
import { addressRouter } from "../route/address.api.js";

export const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(docsRouter);
app.get("/api-docs.json", (req, res) => {
  res.json(swaggerSpec);
});
app.use(
  "/api-docs",
  docsAuthMiddleware,
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, swaggerUiOptions)
);

app.use(publicRouter);
app.use(userRouter);
app.use(contactRouter);
app.use(addressRouter);
app.use(errorMiddleware);
