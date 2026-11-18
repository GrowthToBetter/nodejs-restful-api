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
import { redisClient } from "../web/redis.js";
import { v4 as uuid } from "uuid";
import { toUserResponse } from "../helper/hateoas.js";

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
  const createdUser = await prismaClient.user.create({
    data: user,
    select: {
      username: true,
      name: true,
    },
  });
  return toUserResponse(createdUser);
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

  await redisClient.set(`session:${token}`, existingUser.username, "EX", 86400);

  return { token };
};

const getUserByUsername = async (username) => {
  const user = validate(getUserValidation, username);
  const cacheKey = `user:${user}`;
  const cachedUser = await redisClient.get(cacheKey);
  if (cachedUser) {
    const parsed = JSON.parse(cachedUser);
    parsed._fromCache = true;
    return parsed;
  }

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

  const userResponse = toUserResponse(existingUser);
  await redisClient.set(cacheKey, JSON.stringify(userResponse), "EX", 3600);
  return userResponse;
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
  const updatedUser = await prismaClient.user.update({
    where: {
      username: username,
    },
    data: data,
    select: {
      username: true,
      name: true,
    },
  });

  await redisClient.del(`user:${username}`);
  return toUserResponse(updatedUser);
};

const logout = async (username, token) => {
  username = validate(getUserValidation, username);
  const existingUser = await prismaClient.user.findUnique({
    where: {
      username,
    },
  });
  if (!existingUser) {
    throw new ResponseError(404, "User not found");
  }

  await redisClient.del(`user:${username}`);
  if (token) {
    await redisClient.del(`session:${token}`);
    await redisClient.set(`blacklist:${token}`, "true", "EX", 86400);
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
