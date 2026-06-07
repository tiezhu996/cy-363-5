import { app } from "./app";
import { env } from "./config/env";
import { logger } from "./common/logger";
import { connectDatabase } from "./config/database";

async function startServer() {
  try {
    await connectDatabase();
    app.listen(env.port, "0.0.0.0", () => {
      logger.info(`API listening on port ${env.port}`);
    });
  } catch (error) {
    logger.error(`Failed to start server: ${(error as Error).message}`);
    process.exit(1);
  }
}

startServer();
