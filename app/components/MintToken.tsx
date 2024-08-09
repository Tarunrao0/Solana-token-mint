"use client";

import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import { FC, useState } from "react";
import {
  createMintToInstruction,
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAccount,
} from "@solana/spl-token";

export const MintToForm: FC = () => {
  const [txSig, setTxSig] = useState("");
  const [tokenAccount, setTokenAccount] = useState("");
  const [balance, setBalance] = useState("");
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();
  const link = () => {
    return txSig
      ? `https://explorer.solana.com/tx/${txSig}?cluster=devnet`
      : "";
  };

  const mintTo = async (event: any) => {
    event.preventDefault();
    if (!connection || !publicKey) {
      return;
    }
    const transaction = new web3.Transaction();

    const mintPubKey = new web3.PublicKey(event.target.mint.value);
    const recipientPubKey = new web3.PublicKey(event.target.recipient.value);
    const amount = event.target.amount.value;

    const associatedToken = await getAssociatedTokenAddress(
      mintPubKey,
      recipientPubKey,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    transaction.add(
      createMintToInstruction(mintPubKey, associatedToken, publicKey, amount)
    );

    const signature = await sendTransaction(transaction, connection);

    await connection.confirmTransaction(signature, "confirmed");

    setTxSig(signature);
    setTokenAccount(associatedToken.toString());

    const account = await getAccount(connection, associatedToken);
    setBalance(account.amount.toString());
  };

  return (
    <div className="mt-14 ml-96">
      <div className="ml-80 text-white mb-4">Mint Tokens</div>
      <form
        className="ml-44 bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% ... p-10 rounded-xl w-96 text-lg"
        onSubmit={mintTo}
      >
        <label className="block mb-4" htmlFor="mint">
          Token Mint:
        </label>
        <input
          className="mb-4 bg-coal/25 text-center text-white rounded-lg w-full p-2"
          id="mint"
          type="text"
          required
        />
        <label className="block mb-4" htmlFor="recipient">
          Recipient:
        </label>
        <input
          className="mb-4 bg-coal/25 text-center text-white rounded-lg w-full p-2"
          id="recipient"
          type="text"
          required
        />
        <label className="block mb-4" htmlFor="amount">
          Amount Tokens to Mint:
        </label>
        <input
          className="mb-4 bg-coal/25 text-center text-white rounded-lg w-full p-2"
          id="amount"
          type="text"
          required
        />
        <button
          className="block bg-coal text-white text-xl p-4 w-full rounded-lg"
          type="submit"
        >
          Mint Tokens
        </button>
      </form>
      {txSig ? (
        <div>
          <p>Token Balance: {balance} </p>
          <p>View your transaction on </p>
          <a href={link()}>Solana Explorer</a>
        </div>
      ) : null}
    </div>
  );
};
