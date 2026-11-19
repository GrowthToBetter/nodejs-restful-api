import { prismaClient } from "../web/database.js";
import { ResponseError } from "../error/response.error.js";

export const authMiddleware = async (req, res, next) => {
  const token = req.get("Authorization");
  if (!token) {
    return next(new ResponseError(401, "Unauthorized"));
  }
  const user = await prismaClient.user.findFirst({
    where: {
      token: token,
    },
    select: {
      username: true,
    },
  });
  if (!user) {
    return next(new ResponseError(401, "Unauthorized"));
  }
  req.user = user;

  next();
};
