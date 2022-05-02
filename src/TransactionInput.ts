import { TransactionOutput } from "./TransactionOutput";

export class TransactionInput {
  public transactionOutputId: string;
  public UTXO: TransactionOutput;

  constructor(transactionOutputId: string) {
    this.transactionOutputId = transactionOutputId;
  }
}