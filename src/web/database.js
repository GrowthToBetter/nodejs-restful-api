import { PrismaClient } from "@prisma/client";
import { logger } from "./logging.js";

export const prismaClient = new PrismaClient({
  log: [
    {
      emit: "event",
      level: "query",
    },
    {
      emit: "event",
      level: "error",
    },
    {
      emit: "event",
      level: "info",
    },
    {
      emit: "event",
      level: "warn",
    },
  ],
});

prismaClient.$on("error", (e) => {
  logger.error(`Error: ${e.message}`);
});

prismaClient.$on("info", (e) => {
  logger.info(`Info: ${e.message}`);
});

prismaClient.$on("warn", (e) => {
  logger.warn(`Warn: ${e.message}`);
});

prismaClient.$on("query", (e) => {
  logger.info(
    `Query: ${e.query} | Params: ${e.params} | Duration: ${e.duration}ms`,
  );
});
