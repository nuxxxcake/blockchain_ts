import sha256 from 'sha256';

import { Transaction } from './Transaction';

export class Block {
  private prevHash: string;
  private hash: string;
  private nonce: number;
  private timestamp: string;
  public transactions: Transaction[] = [];

  constructor(prevHash: string) {
    this.prevHash = prevHash;
    this.nonce = 0;
    this.timestamp = Date.now().toString();
    this.hash = this.generateHash();
  }

  public getHash() { return this.hash; }
  public getPrevHash() { return this.prevHash; }

  public generateHash() {
    return sha256(this.prevHash + this.nonce + this.timestamp);
  }

  public mine(difficulty: number) {
    const target = '0'.repeat(difficulty);

    while (this.hash.slice(0, difficulty) !== target) {
      this.nonce++;
      this.hash = this.generateHash();
    }

    console.log("Mined: " + this.hash);
  }

  public addTransaction(transaction: Transaction) {
    if (transaction === null) return false;

    if (this.prevHash !== 'root') {
      if (!transaction.processTransaction()) {
        console.log("Transaction failed to process.");

        return false;
      }
    }

    this.transactions.push(transaction);
    console.log("Transaction successfuly added to Block");
    return true;
  }
}