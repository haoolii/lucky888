import "dotenv/config";
import BettingManagement from "./betting-management";
import { sys } from './gamev2/sys';
import { ply } from './gamev2/ply';
import { delay } from "./core/utils";
import logger from "./core/logger";

const main = async () => {
  // new BettingManagement()
  ply();
  while (true) {
    await sys();
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
