import { logger } from "./web/logging.js";
import { app } from "./web/main.js";

app.listen(3000, () => {
  logger.info("Server is running on port 3000");
});
