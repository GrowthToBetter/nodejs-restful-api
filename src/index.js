import { logger } from "./web/logging.js";
import { app } from "./web/main.js";

const port = process.env.PORT || 3000;

app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
});
