import express from "express";
import { publicRouter } from "../route/public.api.js";
import { errorMiddleware } from "../middleware/error.middleware.js";
import { userRouter } from "../route/user.api.js";
import { contactRouter } from "../route/contact.api.js";
import { addressRouter } from "../route/address.api.js";

export const app = express();
app.use(express.json());

app.use(publicRouter);
app.use(userRouter);
app.use(contactRouter);
app.use(addressRouter);
app.use(errorMiddleware);
