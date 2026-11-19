import { ResponseError } from "../error/response.error.js";
import { logger } from "../web/logging.js";

const errorMiddleware = async (err, req, res, next) => {
  if (err instanceof ResponseError) {
    res.status(err.status).json({ errors: err.message, message: err.message }).end();
  } else {
    logger.error(err);
    res.status(500).json({ errors: "Internal Server Error" }).end();
  }
};

export { errorMiddleware };