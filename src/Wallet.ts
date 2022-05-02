import { PrivateKey, PublicKey } from 'starkbank-ecdsa';

import { BlockChain } from './BlockChain';
import { Transaction } from './Transaction';
import { TransactionInput } from './TransactionInput';
import { TransactionOutput } from './TransactionOutput';

export class Wallet {
  public publicKey: PublicKey;
  public privateKey: PrivateKey;

  public UTXOs = new Map<string, TransactionOutput>();

  constructor() {
    this.generateKeyPair();
  }

  public generateKeyPair() {
    this.privateKey = new PrivateKey();
    this.publicKey = this.privateKey.publicKey();
  }

  public getBalance() {
    let total = 0;

    for (const [id, UTXO] of BlockChain.UTXOs) {
      if (UTXO.isMine(this.publicKey)) {
        this.UTXOs.set(id, UTXO);

        total += UTXO.value;
      }
    }

    return total;
  }

  public sendFunds(_recipient: PublicKey, value: number) {
    if (this.getBalance() < value) {
      console.log("#Not Enough funds to send transaction. Transaction Discarded.");
      return null;
    }

    const inputs: TransactionInput[] = [];
    let total = 0;

    for (const [id, UTXO] of this.UTXOs) {
      total += UTXO.value;
      inputs.push(new TransactionInput(id));
      if (total > value) break;
    }

    const newTransaction = new Transaction(this.publicKey, _recipient, value, inputs);
    newTransaction.generateSignature(this.privateKey);

    for (const input of inputs) {
      this.UTXOs.delete(input.transactionOutputId);
    }

    return newTransaction;
  }
}