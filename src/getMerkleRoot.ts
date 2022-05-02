import sha256 from "sha256";

import { Transaction } from "./Transaction";

export const getMerkleRoot = (transactions: Transaction[]) => {
  // Get all transaction ids
  let transactionsIds: string[] = transactions.map(tx => tx.transactionId);

  while (transactionsIds.length > 1) {
    const currentTreeLayer = [];

    // Generating new nodes in Merkle tree
    for (let i = 1; i < transactionsIds.length; i++) {
      currentTreeLayer.push(sha256(transactionsIds[i - 1] + transactionsIds[i]));
    }

    // Ascending to the root
    transactionsIds = currentTreeLayer;
  }

  return transactionsIds[0] || '';
};