import sha256 from 'sha256';
import { Ecdsa, PrivateKey, PublicKey, Signature } from 'starkbank-ecdsa';

import { BlockChain } from './BlockChain';
import { TransactionOutput } from './TransactionOutput';
import { TransactionInput } from './TransactionInput';

export class Transaction {
  public transactionId: string;
  public value: number;

  public signature: Signature;
  public sender: PublicKey;
  public recipient: PublicKey;

  public inputs: TransactionInput[] = [];
  public outputs: TransactionOutput[] = [];

  private static sequence = 0;

  constructor(from: PublicKey, to: PublicKey, value: number, inputs: TransactionInput[]) {
    this.sender = from;
    this.recipient = to;
    this.value = value;
    this.inputs = inputs;
  }

  public generateSignature(privateKey: PrivateKey) {
    const data: string = this.sender.toString() + this.recipient.toString() + this.value;
    this.signature = Ecdsa.sign(data, privateKey);
  }

  public verifySignature() {
    const data: string = this.sender.toString() + this.recipient.toString() + this.value;
    return Ecdsa.verify(data, this.signature, this.sender);
  }

  public processTransaction() {
    if (!this.verifySignature()) {
      console.log("#Transaction signature failed to verify");
      return false;
    }

    for (let i = 0; i < this.inputs.length; i++) {
      const input = this.inputs[i];

      if (!input) continue;

      input.UTXO = BlockChain.UTXOs.get(input.transactionOutputId) as TransactionOutput;
    }

    if (this.getInputsValue() < BlockChain.minimumTransaction) {
      console.log("#Transaction Inputs too small: ", this.getInputsValue());
      return false;
    }

    const leftOver = this.getInputsValue() - this.value;
    this.transactionId = this.calculateHash();

    this.outputs.push(new TransactionOutput(this.recipient, this.value, this.transactionId));
    this.outputs.push(new TransactionOutput(this.sender, leftOver, this.transactionId));

    for (const output of this.outputs) {
      BlockChain.UTXOs.set(output.id, output);
    }

    for (const input of this.inputs) {
      if (input.UTXO === null) continue;

      BlockChain.UTXOs.delete(input.UTXO.id);
    }

    return true;
  }

  public getInputsValue() {
    let total = 0;

    for (const input of this.inputs) {
      if (input.UTXO === null) continue;

      total += input.UTXO.value;
    }

    return total;
  }

  public getOutpusValue() {
    let total = 0;

    for (const output of this.outputs) {
      total += output.value;
    }

    return total;
  }

  private calculateHash() {
    Transaction.sequence++;

    return sha256(this.sender.toString() + this.recipient.toString() + this.value + Transaction.sequence);
  }
} 