import { ResponseError } from "../error/response.error.js";
import { registerUserValidation } from "../validation/user.validation.js";
import { validate } from "../validation/validation.js";
import bcrypt from "bcrypt";
import { prismaClient } from "../web/database.js";
const register = async (userData) => {
  const user = validate(registerUserValidation, userData);
  const isUserExist = await prismaClient.user.findUnique({
    where: {
      username: user.username,
    },
  });
  if (isUserExist) {
    throw new ResponseError(400, "User already exists");
  }
  user.password = await bcrypt.hash(user.password, 10);
  return prismaClient.user.create({
    data: user,
    select: {
      username: true,
      name: true,
    },
  });
};

export default {
  register,
};
