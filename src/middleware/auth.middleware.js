import { prismaClient } from "../web/database.js";

export const authMiddleware = async (req, res, next) => {
  const token = req.get("Authorization");
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" }).end();
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
    return res.status(401).json({ message: "Unauthorized" }).end();
  }
  req.user = user;

  next();
};
