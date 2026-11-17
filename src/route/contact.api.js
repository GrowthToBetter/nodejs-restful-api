import express from "express";
import contactController from "../controller/contact.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const contactRouter = express.Router();
contactRouter.use(authMiddleware);
contactRouter.post("/api/contacts", contactController.create);
contactRouter.get("/api/contacts/:id", contactController.get);
contactRouter.patch("/api/contacts/:id", contactController.update);
contactRouter.delete("/api/contacts/:id", contactController.remove);
contactRouter.get("/api/contacts", contactController.search);

export { contactRouter };
