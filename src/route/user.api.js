import express from "express";
import userController from "../controller/user.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const userRouter = express.Router();
userRouter.use(authMiddleware);

/**
 * @openapi
 * /api/users/me:
 *   get:
 *     summary: Get current user information
 *     tags:
 *       - User
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse401'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse500'
 */
userRouter.get("/api/users/me", userController.get);

/**
 * @openapi
 * /api/users/me:
 *   patch:
 *     summary: Update current user information
 *     tags:
 *       - User
 *     security:
 *       - ApiKeyAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdateRequest'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse400'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse401'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse500'
 */
userRouter.patch("/api/users/me", userController.update);

/**
 * @openapi
 * /api/users/logout:
 *   delete:
 *     summary: Logout current user
 *     tags:
 *       - User
 *     security:
 *       - ApiKeyAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserLogoutResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse401'
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse500'
 */
userRouter.delete("/api/users/logout", userController.logout);

export { userRouter };
