import { ResponseError } from "../error/response.error.js";
import {
  createContactValidation,
  getContactValidation,
  searchContactValidation,
  updateContactValidation,
} from "../validation/contact.validation.js";
import { validate } from "../validation/validation.js";
import { prismaClient } from "../web/database.js";
import { redisClient } from "../web/redis.js";
import {
  toContactResponse,
  toContactSearchResponse,
} from "../helper/hateoas.js";

const create = async (user, request) => {
  const validatedUser = validate(createContactValidation, request);

  const createdContact = await prismaClient.contact.create({
    data: {
      ...validatedUser,
      username: user.username,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
    },
  });

  return toContactResponse(createdContact);
};

const get = async (user, contactId) => {
  const validatedContactId = validate(getContactValidation, contactId);
  const cacheKey = `contact:${user.username}:${validatedContactId}`;
  const cachedContact = await redisClient.get(cacheKey);
  if (cachedContact) {
    const parsed = JSON.parse(cachedContact);
    parsed._fromCache = true;
    return parsed;
  }

  const contact = await prismaClient.contact.findFirst({
    where: {
      id: validatedContactId,
      username: user.username,
      deleted_at: null,
    },
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
    },
  });

  if (!contact) {
    throw new ResponseError(404, "Contact not found");
  }

  const contactResponse = toContactResponse(contact);
  await redisClient.set(cacheKey, JSON.stringify(contactResponse), "EX", 3600);
  return contactResponse;
};

const update = async (user, contactId, request) => {
  const validatedContactId = validate(getContactValidation, contactId);
  const validatedContact = validate(updateContactValidation, request);
  const existingContact = await prismaClient.contact.findFirst({
    where: {
      id: validatedContactId,
      username: user.username,
      deleted_at: null,
    },
  });
  if (!existingContact) {
    throw new ResponseError(404, "Contact not found");
  }

  const updatedContact = await prismaClient.contact.update({
    where: {
      id: validatedContactId,
      username: user.username,
    },
    data: validatedContact,
    select: {
      id: true,
      first_name: true,
      last_name: true,
      email: true,
      phone: true,
    },
  });

  await redisClient.del(`contact:${user.username}:${validatedContactId}`);
  return toContactResponse(updatedContact);
};

const remove = async (user, contactId) => {
  const validatedContactId = validate(getContactValidation, contactId);
  const existingContact = await prismaClient.contact.findFirst({
    where: {
      id: validatedContactId,
      username: user.username,
      deleted_at: null,
    },
  });
  if (!existingContact) {
    throw new ResponseError(404, "Contact not found");
  }

  await redisClient.del(`contact:${user.username}:${validatedContactId}`);

  await prismaClient.address.updateMany({
    where: {
      contact_id: validatedContactId,
      deleted_at: null,
    },
    data: {
      deleted_at: new Date(),
    },
  });

  return prismaClient.contact.update({
    where: {
      id: validatedContactId,
      username: user.username,
    },
    data: {
      deleted_at: new Date(),
    },
  });
};

const search = async (user, request) => {
  request = validate(searchContactValidation, request);
  const skip = (request.page - 1) * request.size;
  const filters = [];
  filters.push({
    username: user.username,
  });
  filters.push({
    deleted_at: null,
  });
  if (request.name) {
    filters.push({
      OR: [
        {
          first_name: {
            contains: request.name,
          },
        },
        {
          last_name: {
            contains: request.name,
          },
        },
      ],
    });
  }
  if (request.email) {
    filters.push({
      email: {
        contains: request.email,
      },
    });
  }
  if (request.phone) {
    filters.push({
      phone: {
        contains: request.phone,
      },
    });
  }

  const [contacts, totalItems] = await prismaClient.$transaction([
    prismaClient.contact.findMany({
      where: {
        AND: filters,
      },
      take: request.size,
      skip: skip,
    }),
    prismaClient.contact.count({
      where: {
        AND: filters,
      },
    }),
  ]);

  return toContactSearchResponse(
    contacts,
    {
      page: request.page,
      total_items: totalItems,
      total_page: Math.ceil(totalItems / request.size),
    },
    request.size,
  );
};

export default {
  create,
  get,
  update,
  remove,
  search,
};
