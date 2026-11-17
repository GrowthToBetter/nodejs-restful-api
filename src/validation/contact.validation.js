import Joi from "joi";

export const createContactValidation = Joi.object({
  first_name: Joi.string().max(255).required(),
  last_name: Joi.string().max(255).optional(),
  email: Joi.string().email().max(255).optional(),
  phone: Joi.string().max(20).optional(),
});

export const getContactValidation = Joi.number().positive().required();

export const updateContactValidation = Joi.object({
  first_name: Joi.string().max(255).required(),
  last_name: Joi.string().max(255).optional(),
  email: Joi.string().email().max(255).optional(),
  phone: Joi.string().max(20).optional(),
});

export const searchContactValidation = Joi.object({
    page: Joi.number().min(1).positive().default(1),
    size: Joi.number().min(1).positive().max(100).default(10),
    name: Joi.string().optional(),
    email: Joi.string().optional(),
    phone: Joi.string().optional(),
})
