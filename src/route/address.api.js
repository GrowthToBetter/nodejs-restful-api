import express from "express";
import addressController from "../controller/address.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const addressRouter = express.Router();
addressRouter.use(authMiddleware);

addressRouter.post(
  "/api/contacts/:contactId/addresses",
  addressController.create,
);
addressRouter.get(
  "/api/contacts/:contactId/addresses/:addressId",
  addressController.get,
);
addressRouter.put(
  "/api/contacts/:contactId/addresses/:addressId",
  addressController.update,
);
addressRouter.put(
  "/api/contacts/:contactId/adresses/:addressId",
  addressController.update,
);
addressRouter.patch(
  "/api/contacts/:contactId/addresses/:addressId",
  addressController.update,
);
addressRouter.delete(
  "/api/contacts/:contactId/addresses/:addressId",
  addressController.remove,
);
addressRouter.get("/api/contacts/:contactId/addresses", addressController.list);

export { addressRouter };
