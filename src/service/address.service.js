import { ResponseError } from "../error/response.error.js";
import {
  createAddressValidation,
  getAddressValidation,
  updateAddressValidation,
} from "../validation/address.validation.js";
import { getContactValidation } from "../validation/contact.validation.js";
import { validate } from "../validation/validation.js";
import { prismaClient } from "../web/database.js";

const checkContactMustExists = async (user, contactId) => {
  const validatedContactId = validate(getContactValidation, contactId);

  const contact = await prismaClient.contact.findFirst({
    where: {
      id: validatedContactId,
      username: user.username,
    },
  });

  if (!contact) {
    throw new ResponseError(404, "Contact not found");
  }

  return contact;
};

const create = async (user, contactId, request) => {
  const contact = await checkContactMustExists(user, contactId);
  const validatedAddress = validate(createAddressValidation, request);

  return prismaClient.address.create({
    data: {
      ...validatedAddress,
      contact_id: contact.id,
    },
    select: {
      id: true,
      street: true,
      city: true,
      province: true,
      country: true,
      postal_code: true,
    },
  });
};

const get = async (user, contactId, addressId) => {
  const contact = await checkContactMustExists(user, contactId);
  const validatedAddressId = validate(getAddressValidation, addressId);

  const address = await prismaClient.address.findFirst({
    where: {
      id: validatedAddressId,
      contact_id: contact.id,
    },
    select: {
      id: true,
      street: true,
      city: true,
      province: true,
      country: true,
      postal_code: true,
    },
  });

  if (!address) {
    throw new ResponseError(404, "address not found");
  }

  return address;
};

const update = async (user, contactId, addressId, request) => {
  const contact = await checkContactMustExists(user, contactId);
  const validatedAddressId = validate(getAddressValidation, addressId);
  const validatedAddress = validate(updateAddressValidation, request);

  const existingAddress = await prismaClient.address.findFirst({
    where: {
      id: validatedAddressId,
      contact_id: contact.id,
    },
  });

  if (!existingAddress) {
    throw new ResponseError(404, "address not found");
  }

  return prismaClient.address.update({
    where: {
      id: validatedAddressId,
    },
    data: validatedAddress,
    select: {
      id: true,
      street: true,
      city: true,
      province: true,
      country: true,
      postal_code: true,
    },
  });
};

const remove = async (user, contactId, addressId) => {
  const contact = await checkContactMustExists(user, contactId);
  const validatedAddressId = validate(getAddressValidation, addressId);

  const existingAddress = await prismaClient.address.findFirst({
    where: {
      id: validatedAddressId,
      contact_id: contact.id,
    },
  });

  if (!existingAddress) {
    throw new ResponseError(404, "address not found");
  }

  return prismaClient.address.delete({
    where: {
      id: validatedAddressId,
    },
  });
};

const list = async (user, contactId) => {
  const contact = await checkContactMustExists(user, contactId);

  return prismaClient.address.findMany({
    where: {
      contact_id: contact.id,
    },
    select: {
      id: true,
      street: true,
      city: true,
      province: true,
      country: true,
      postal_code: true,
    },
  });
};

export default {
  create,
  get,
  update,
  remove,
  list,
};
