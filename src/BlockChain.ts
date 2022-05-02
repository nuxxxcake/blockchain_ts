import { Block } from "./Block";
import { TransactionOutput } from "./TransactionOutput";

export class BlockChain {
  private chain: Block[] = [];
  public static UTXOs = new Map<string, TransactionOutput>();
  public static minimumTransaction = 0.1;
  public static difficulty = 5;

  public getChain() {
    return this.chain;
  }

  public isChainValid() {
    if (this.chain[0].getPrevHash() !== 'root') return false;

    for (let i = 2; i < this.chain.length; i++) {
      if (!this.isValid(i, i - 1)) return false;
    }

    return true;
  }

  private isValid(currentBlockIndex: number, prevBlockIndex: number) {
    const currentBlock = this.chain[currentBlockIndex];
    const prevBlock = this.chain[prevBlockIndex];

    const tempUTXOs = new Map<string, TransactionOutput>();

    if (currentBlock.getHash() !== currentBlock.generateHash()) return false;

    if (prevBlock.getHash() !== currentBlock.getPrevHash()) return false;

    if (currentBlock.getHash().slice(0, BlockChain.difficulty) !== '0'.repeat(BlockChain.difficulty)) return false;

    let tempOutput: TransactionOutput | undefined;

    for (let i = 0; i < currentBlock.transactions.length; i++) {
      const currentTransaction = currentBlock.transactions[i];

      if (!currentTransaction.verifySignature()) return false;

      if (currentTransaction.getInputsValue() !== currentTransaction.getOutpusValue()) return false;

      for (const input of currentTransaction.inputs) {
        tempOutput = tempUTXOs.get(input.transactionOutputId);

        if (!tempOutput) return false;

        if (input.UTXO.value !== tempOutput.value) return false;

        tempUTXOs.delete(input.transactionOutputId);
      }

      for (const output of currentTransaction.outputs) {
        tempUTXOs.set(output.id, output);
      }

      if (currentTransaction.outputs[0].recipient != currentTransaction.recipient) {
        console.log("#Transaction(" + i + ") output recipient is not who it should be");
        return false;
      }
      if (currentTransaction.outputs[1].recipient != currentTransaction.sender) {
        console.log("#Transaction(" + i + ") output 'change' is not sender.");
        return false;
      }
    }

    console.log("Blockchain is valid");

    return true;
  }

  public addBlock(newBlock: Block) {
    newBlock.mine(BlockChain.difficulty);
    this.chain.push(newBlock);
  }
}