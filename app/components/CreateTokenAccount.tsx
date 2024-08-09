"use client";

import React, { FC } from "react";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import * as web3 from "@solana/web3.js";
import {
  getAssociatedTokenAddress,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
} from "@solana/spl-token";
import { useState } from "react";
import { MintToForm } from "./MintToken";

const CreateTokenAccount: FC = () => {
  const [txSig, setTxSig] = useState("");
  const [tokenAccount, setTokenAccount] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  const createTokenAccount = async (event: any) => {
    event.preventDefault();
    if (!connection || !publicKey) {
      return;
    }
    const transaction = new web3.Transaction();
    const owner = new web3.PublicKey(event.target.owner.value);
    const mint = new web3.PublicKey(event.target.mint.value);
    //Owner address of the token Account

    const associatedToken = await getAssociatedTokenAddress(
      mint,
      owner,
      false,
      TOKEN_PROGRAM_ID,
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    //Lets create an ATA account for the owner
    transaction.add(
      createAssociatedTokenAccountInstruction(
        publicKey,
        associatedToken,
        owner,
        mint,
        TOKEN_PROGRAM_ID,
        ASSOCIATED_TOKEN_PROGRAM_ID
      )
    );

    sendTransaction(transaction, connection).then((sig) => {
      setTxSig(sig);
      setTokenAccount(associatedToken.toString());
      setConfirmed(true);
    });
  };

  return (
    <div className="mt-14 ml-96">
      <div className="ml-44">
        <div className="ml-28 text-white mb-4">Create Token Mint</div>
        <div className="flex">
          <form
            onSubmit={createTokenAccount}
            className="bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% ... p-10 rounded-xl w-96 text-lg"
          >
            <label className="mb-4 block">Token Mint Address: </label>
            <input
              className="mb-4 bg-coal/25 text-center text-white rounded-lg w-full p-2"
              id="mint"
              required
            />
            <label className="mb-4 block">Token Account Owner: </label>
            <input
              className="mb-4 bg-coal/25 text-center text-white rounded-lg w-full p-2"
              id="owner"
              required
            />
            <button className="block bg-coal text-white text-xl p-4 w-full rounded-lg">
              Create
            </button>
          </form>
        </div>
        <div className="max-w-lg mx-auto mt-4 text-black mr-20">
          {confirmed ? (
            <p className="w-full">
              You can view your transaction on Solana Explorer at:
              <a
                href={`https://explorer.solana.com/tx/${txSig}?cluster=devnet`}
                target="_blank"
                rel="noopener noreferrer"
                className="block text-green-500 underline w-1/5 text-sm"
              >
                {`https://explorer.solana.com/tx/${txSig}?cluster=devnet`}
              </a>
            </p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default CreateTokenAccount;
