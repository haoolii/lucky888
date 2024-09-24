import "dotenv/config";
import logger from "./core/logger";
import { delay } from "./core/utils";
import { txo } from "./txo/txo";
import { round } from "./round/round";

const main = async () => {
  txo();
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
