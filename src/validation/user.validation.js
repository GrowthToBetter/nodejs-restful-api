import joi from "joi";

const registerUserValidation = joi.object({
  name: joi.string().max(255).required(),
  username: joi.string().max(100).required(),
  password: joi.string().min(6).max(100).required(),
});


export { registerUserValidation };