import { sleep } from "./src/helpers.js";
import { runAppTicker } from "./src/app.js";
import { logger } from "./src/logger.js";
import { connectDatabse } from "./src/db.js";
import * as dotenv from "dotenv";

dotenv.config();

logger.info("Applicaion connecting to database...");

let isConnected = false;

await connectDatabse()
  .then((_) => {
    logger.info("Successfull connection with database.");
    isConnected = true;
  })
  .catch((err) => {
    logger.error("Error, Cannot connect with external database.");
  });

if (isConnected) {
  logger.info("Application running.");
  main();
}

async function main() {
  if (!process.env.TICK_RATE) {
    logger.error("Error, application needs configuration data.");
    return;
  }

  while (true) {
    let tickRate;

    try {
      await runAppTicker();

      tickRate = process.env.TICK_RATE;
    } catch (e) {
      logger.error(
        `Error occured during get/put data from external server. Details: ${e.message}`
      );
      tickRate = 10000;
    }

    await sleep(tickRate);
  }
}
