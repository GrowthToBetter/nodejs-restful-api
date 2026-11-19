import joi from "joi";

const registerUserValidation = joi.object({
  name: joi.string().max(255).required(),
  username: joi.string().max(100).required(),
  password: joi.string().min(6).max(100).required(),
});

const loginUserValidation = joi.object({
  username: joi.string().max(100).required(),
  password: joi.string().min(6).max(100).required(),
});

const getUserValidation = joi.string().max(100).required();

const updateUserValidation = joi.object({
  name: joi.string().max(255).optional(),
  password: joi.string().min(6).max(100).optional(),
});

export { registerUserValidation, loginUserValidation, getUserValidation, updateUserValidation };
