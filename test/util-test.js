import { prismaClient } from "../src/web/database.js";
import { redisClient } from "../src/web/redis.js";
import bcrypt from "bcrypt";

const removeTestUser = async (username = "test") => {
  await redisClient.del(`user:${username}`);
  await redisClient.del(`session:${username}`);
  await redisClient.del(`blacklist:${username}`);
  await prismaClient.address.deleteMany({
    where: { contact: { username } },
  });
  await prismaClient.contact.deleteMany({ where: { username } });
  await prismaClient.user.deleteMany({ where: { username } });
};

const removeTestContactUser = async () => {
  const keys = await redisClient.keys("contact:testcontact:*");
  if (keys.length > 0) {
    await redisClient.del(...keys);
  }
  await removeTestUser("testcontact");
};

const createTestUser = async () => {
  await removeTestUser();
  const hashedPassword = await bcrypt.hash("password123", 10);
  await prismaClient.user.create({
    data: {
      name: "TESTING",
      username: "test",
      password: hashedPassword,
      token: "test",
    },
  });
  await redisClient.set("session:test", "test", "EX", 86400);
};

const createTestContactUser = async () => {
  await removeTestContactUser();
  const hashedPassword = await bcrypt.hash("password123", 10);
  await prismaClient.user.create({
    data: {
      name: "TESTING",
      username: "testcontact",
      password: hashedPassword,
      token: "testcontact",
    },
  });
  await redisClient.set("session:testcontact", "testcontact", "EX", 86400);
  await prismaClient.contact.create({
    data: {
      first_name: "John",
      last_name: "Doe",
      email: "john.doe@example.com",
      phone: "1234567890",
      username: "testcontact",
    },
  });
};

const createManyTestContact = async () => {
  await prismaClient.contact.deleteMany({ where: { username: "testcontact" } });
  const contacts = [];
  for (let i = 0; i < 15; i++) {
    contacts.push({
      username: "testcontact",
      first_name: `test ${i}`,
      last_name: `test ${i}`,
      email: `test${i}@gmail.com`,
      phone: `018828283${i}`,
    });
  }
  await prismaClient.contact.createMany({
    data: contacts,
  });
};

const getTestContact = async () => {
  return prismaClient.contact.findFirst({
    where: { username: "testcontact" },
  });
};

const createTestAddress = async () => {
  const contact = await getTestContact();
  await prismaClient.address.create({
    data: {
      contact_id: contact.id,
      street: "jl danur wenda 3",
      city: "malang",
      province: "jatim",
      country: "indonesia",
      postal_code: "65362",
    },
  });
};

const getTestAddress = async () => {
  return prismaClient.address.findFirst({
    where: {
      contact: {
        username: "testcontact",
      },
    },
  });
};

const removeTestAddress = async () => {
  await prismaClient.address.deleteMany({
    where: {
      contact: {
        username: "testcontact",
      },
    },
  });
};

export {
  removeTestUser,
  removeTestContactUser,
  createTestUser,
  createTestContactUser,
  createManyTestContact,
  getTestContact,
  createTestAddress,
  getTestAddress,
  removeTestAddress,
};
