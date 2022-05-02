import sha256 from "sha256";
import { PublicKey } from "starkbank-ecdsa";

export class TransactionOutput {
  public id: string;
  public recipient: PublicKey;
  public value: number;
  public parentTransactionId: string;

  constructor(recipient: PublicKey, value: number, parentTransactionId: string) {
    this.recipient = recipient;
    this.value = value;
    this.parentTransactionId = parentTransactionId;
    this.id = sha256(recipient.toString() + value.toString() + parentTransactionId);
  }

  public isMine(publicKey: PublicKey): boolean {
    return (publicKey.toString() === this.recipient.toString());
  }
}