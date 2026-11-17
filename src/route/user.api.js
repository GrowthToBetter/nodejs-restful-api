import express from "express";
import userController from "../controller/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const userRouter = express.Router();
userRouter.use(authMiddleware);
userRouter.get("/api/users/me", userController.get);
userRouter.patch("/api/users", userController.update);
userRouter.post("/api/users/logout", userController.logout);



export { userRouter };
