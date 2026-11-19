import Joi from "joi";

export const createAddressValidation = Joi.object({
  street: Joi.string().max(255).optional(),
  city: Joi.string().max(100).optional(),
  province: Joi.string().max(100).optional(),
  country: Joi.string().max(100).required(),
  postal_code: Joi.alternatives().try(Joi.string().max(20), Joi.number().cast("string")).required(),
});

export const getAddressValidation = Joi.number().positive().required();

export const updateAddressValidation = Joi.object({
  street: Joi.string().max(255).optional(),
  city: Joi.string().max(100).optional(),
  province: Joi.string().max(100).optional(),
  country: Joi.string().max(100).optional(),
  postal_code: Joi.alternatives().try(Joi.string().max(20), Joi.number().cast("string")).optional(),
});
