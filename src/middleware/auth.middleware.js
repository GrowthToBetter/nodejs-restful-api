import { prismaClient } from "../web/database.js";
import { redisClient } from "../web/redis.js";
import { ResponseError } from "../error/response.error.js";

export const authMiddleware = async (req, res, next) => {
  const token = req.get("Authorization");
  if (!token) {
    return next(new ResponseError(401, "Unauthorized"));
  }

  const isBlacklisted = await redisClient.get(`blacklist:${token}`);
  if (isBlacklisted) {
    return res.status(401).json({ message: "Unauthorized" }).end();
  }

  const sessionUsername = await redisClient.get(`session:${token}`);
  if (sessionUsername) {
    req.user = { username: sessionUsername };
    return next();
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

  await redisClient.set(`session:${token}`, user.username, "EX", 86400);
  req.user = user;

  next();
};
