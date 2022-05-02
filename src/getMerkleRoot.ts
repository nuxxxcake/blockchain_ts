import sha256 from "sha256";

import { Transaction } from "./Transaction";

export const getMerkleRoot = (transactions: Transaction[]) => {
  let count = transactions.length;

  let previousTreeLayer: string[] = [];

  for (const transaction of transactions) {
    previousTreeLayer.push(transaction.transactionId);
  }

  const treeLayer: string[] = previousTreeLayer;

  while (count > 1) {
    const treeLayer = [];

    for (let i = 1; i < previousTreeLayer.length; i++) {
      treeLayer.push(sha256(previousTreeLayer[i - 1] + previousTreeLayer[i]));
    }

    count = treeLayer.length;
    previousTreeLayer = treeLayer;
  }

  const merkleRoot = (treeLayer.length === 1) ? treeLayer[0] : '';

  return merkleRoot;
};