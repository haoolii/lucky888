import worker_threads from "worker_threads";
type TX = {
  playerId: string;
  amount: string;
};

enum TXQ_MESSAGE_KEY {
  PLACE_BET = "PLACE_BET",
}

class TxQueue {
  queue: Array<TX> = [];
  processing = false;

  constructor() {
    this.queue = [];
    this.processing = false;
  }

  addTransaction(tx: TX) {
    this.queue.push(tx);
    console.log("Transaction added:", tx);
    this.processQueue();
  }

  async processQueue() {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const tx = this.queue.shift();
      if (tx) {
        await this.handleTransaction(tx);
      }
      // parentPort.postMessage({ type: 'transactionProcessed', orderId: transaction.orderId });
    }

    this.processing = false;
  }

  handleTransaction(tx: TX) {
    return new Promise((resolve) => {
      setTimeout(() => {
        // console.log(`Transaction processed for orderId: ${transaction.orderId}`);
        resolve(tx);
      }, Math.random() * 1000);
    });
  }
}