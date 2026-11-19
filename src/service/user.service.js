import { ResponseError } from "../error/response.error.js";
import {
  getUserValidation,
  loginUserValidation,
  registerUserValidation,
  updateUserValidation,
} from "../validation/user.validation.js";
import { validate } from "../validation/validation.js";
import bcrypt from "bcrypt";
import { prismaClient } from "../web/database.js";
import { v4 as uuid } from "uuid";

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

const login = async (userData) => {
  const user = validate(loginUserValidation, userData);
  const existingUser = await prismaClient.user.findUnique({
    where: {
      username: user.username,
    },
    select: {
      username: true,
      password: true,
    },
  });
  if (!existingUser) {
    throw new ResponseError(401, "Username or password wrong");
  }
  const isPasswordValid = await bcrypt.compare(
    user.password,
    existingUser.password,
  );
  if (!isPasswordValid) {
    throw new ResponseError(401, "Username or password wrong");
  }
  const token = uuid().toString();
  await prismaClient.user.update({
    where: {
      username: existingUser.username,
    },
    data: {
      token: token,
    },
    select: {
      token: true,
    },
  });

  return { token };
};

const getUserByUsername = async (username) => {
  const user = validate(getUserValidation, username);
  const existingUser = await prismaClient.user.findUnique({
    where: {
      username: user,
    },
    select: {
      username: true,
      name: true,
    },
  });
  if (!existingUser) {
    throw new ResponseError(404, "User not found");
  }
  return existingUser;
};

const updateUser = async (username, userData) => {
  const user = validate(updateUserValidation, userData);
  const existingUser = await prismaClient.user.findUnique({
    where: {
      username: username,
    },
    select: {
      username: true,
      name: true,
      password: true,
    },
  });
  if (!existingUser) {
    throw new ResponseError(404, "User not found");
  }
  const data = {};
  if (user.password) {
    data.password = await bcrypt.hash(user.password, 10);
  }
  if (user.name) {
    data.name = user.name;
  }
  return prismaClient.user.update({
    where: {
      username: username,
    },
    data: data,
    select: {
      username: true,
      name: true,
    },
  });
};

const logout = async (username) => {
  username = validate(getUserValidation, username);
  const existingUser = await prismaClient.user.findUnique({
    where: {
      username,
    },
  });
  if (!existingUser) {
    throw new ResponseError(404, "User not found");
  }
  return prismaClient.user.update({
    where: {
      username,
    },
    data: {
      token: null,
    },
    select: {
      username: true,
    },
  });
};

export default {
  register,
  login,
  getUserByUsername,
  updateUser,
  logout,
};
