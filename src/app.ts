import "dotenv/config";
import { delay } from "./core/utils";
import logger from "./core/logger";
import { txo } from "./txo/txo";
import { round } from "./round/round";
import { getRoundPlayerBets } from "./round/service";
import db from "./db";

const main = async () => {
  // txo();
  // await getRoundPlayerBets(db, 'd7425059-5581-4ca5-8159-6bd746d15c9f');
  while (true) {
    await round();
    await delay(5000);
    memoryLog();
    logger.info('Next Round');
  }
};

const memoryLog = () => {
  const memoryUsage = process.memoryUsage();
  console.log("==================================================");
  console.log("Memory Usage:");
  console.log(`RSS: ${memoryUsage.rss / 1024 / 1024} MB`);
  console.log(`Heap Total: ${memoryUsage.heapTotal / 1024 / 1024} MB`);
  console.log(`Heap Used: ${memoryUsage.heapUsed / 1024 / 1024} MB`);
  console.log(`External: ${memoryUsage.external / 1024 / 1024} MB`);
  console.log(`Array Buffers: ${memoryUsage.arrayBuffers / 1024 / 1024} MB`);
  console.log("==================================================");
}

export default main;
