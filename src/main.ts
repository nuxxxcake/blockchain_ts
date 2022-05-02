import { BlockChain } from "./BlockChain";
import { Wallet } from "./Wallet";
import { Transaction } from "./Transaction";
import { TransactionOutput } from "./TransactionOutput";
import { Block } from "./Block";

function main() {
  const blockchain = new BlockChain();

  const walletA = new Wallet();
  const walletB = new Wallet();

  const coinBase = new Wallet();

  const genesisTransaction = new Transaction(coinBase.publicKey, walletA.publicKey, 100, []);
  genesisTransaction.generateSignature(coinBase.privateKey);
  genesisTransaction.transactionId = 'root';
  genesisTransaction.outputs.push(
    new TransactionOutput(genesisTransaction.recipient, genesisTransaction.value, genesisTransaction.transactionId)
  );
  BlockChain.UTXOs.set(genesisTransaction.outputs[0].id, genesisTransaction.outputs[0]);

  console.log('Creating and mining genesis block');
  const genesis = new Block('root');
  genesis.addTransaction(genesisTransaction);
  blockchain.addBlock(genesis);

  const block1 = new Block(genesis.getHash());

  console.log("\nWalletA's balance is: " + walletA.getBalance());
  console.log("\nWalletA is Attempting to send funds (40) to WalletB...");

  const transaction = walletA.sendFunds(walletB.publicKey, 40);

  transaction && block1.addTransaction(transaction);
  blockchain.addBlock(block1);

  console.log("\nWalletA's balance is: " + walletA.getBalance());
  console.log("WalletB's balance is: " + walletB.getBalance());

  console.log(
    blockchain.isChainValid()
  );
}

main();